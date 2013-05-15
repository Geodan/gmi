<?php
// $Id: proxy.php,v 1.1.2.10 2010/04/23 12:10:36 openwereld Exp $

/**
 * @file
 * Proxy script using copy of drupal_http_request function.
 *
 * This proxy script can be secured by setting the permitted targets and
 * the permitted content types of responses.
 * @TODO return response as a stream
 * @TODO remove debugging
 */

$debug = FALSE;

// Silent errors
ini_set('display_errors', FALSE);

// Copy proxy settings to a separate file otherwise it may be overwritten by a
// next release of this module.
$proxy_settings_path = ''; // path relative to this file, e.g. proxy.settings.inc
if (! empty($proxy_settings_path)) {
  include($proxy_settings_path);
}
else {
  $proxy_settings = array(
    // Permitted urls. Use this if permitted hosts is not restrictive enough and you
    // want to specify how an url should start.
    'permitted_urls' => array(),
    
    // Regular expression with permitted hosts
    // E.g. "/^localhost\$|^aardbodem\.nl\$/"
    'permitted_hosts_regex' => "",
    
    // Regular expression with forbidden hosts
    // E.g. "/^localhost\$/"
    'forbidden_hosts_regex' => "",
    
    // Regular expression with permitted content types for response. Make empty                                 
    // to return content of any type.
    'permitted_content_types_regex' => "/^text\/|^image\/|^application\/vnd\.|^application\/xml/",
    );
}

// Http headers to ignore. These will not be passed to the target.
$ignore_headers = array('HTTP_HOST', 'HTTP_KEEP_ALIVE', 'HTTP_CONNECTION');

// Init useful vars
$headers = array();

// Check for 'url' GET parameter
if (! $url = $_GET['url']) {
  if ($proxy_inclusion === TRUE) {
    // this file is included by admin validation
    return;
  }
  header('HTTP/1.1 400 Bad Request');
  die('Url missing');
}
if ($debug) echo '_GET = '. var_export($_GET, true) ."<br/>\n";

if (! empty($proxy_settings['permitted_hosts_regex'])) {
  // Check for permitted targets
  if (0 == preg_match($proxy_settings['permitted_hosts_regex'], parse_url($url, PHP_URL_HOST))) {
    header('HTTP/1.1 403 Forbidden');
    die('Target not permitted.');
  }
}
if (! empty($proxy_settings['forbidden_hosts_regex'])) {
  // Check for forbidden targets
  if (0 != preg_match($proxy_settings['forbidden_hosts_regex'], parse_url($url, PHP_URL_HOST))) {
    header('HTTP/1.1 403 Forbidden');
    die('Target not permitted.');
  }
}
if (! empty($proxy_settings['permitted_urls'])) {
  // Check if url starts with a permitted url
  $permitted = FALSE;
  foreach ($proxy_settings['permitted_urls'] as $permitted_url) {
    if (strpos($url, $permitted_url) === 0) {
      $permitted = TRUE;
      break;
    }
  }
  if (! $permitted) {
    header('HTTP/1.1 403 Forbidden');
    die('Url not permitted.');
  }
}

// Build up correct GET parameters using remaining ones from request
// Unset useless 'url' parameter for remote server
unset($_GET['url']);
$sep = strpos($url, '?') == FALSE ? '?' : (substr($url, -1) == '&' ? '' : '&');
foreach ($_GET as $key => $value) {
  $url .= $sep . $key .'='. urlencode($value);
  $sep = '&';
}

// Send back the right method
$method = $_SERVER['REQUEST_METHOD'];

/*
 * Common awaited Content-Type header values:
 *  - Content-Type: text/html
 *  - Content-Type: application/x-www-form-urlencoded
 *  - Content-Type: multipart/form-data
 *  - Content-Type: application/xml
 * The fact is, whatever sends the remote client, if this header is present we
 * must send back data, which we get back. 
 */
if (isset($_SERVER['CONTENT_TYPE']) && ! empty($_SERVER['CONTENT_LENGTH'])) {
  // Get back the correct data
  $headers['Content-Type'] = $_SERVER['CONTENT_TYPE'];
  $headers['Content-Length'] = $_SERVER['CONTENT_LENGTH'];
  $data = @file_get_contents('php://input');
  //$data = @$GLOBALS["HTTP_RAW_POST_DATA"];
}
else {
  $data = NULL;
}

/*
 * Additional request headers present in $_SERVER with prefix HTTP_.
 * E.g. HTTP_ACCEPT etc.
 */
foreach ($_SERVER as $key => $value) {
  if (strpos($key, 'HTTP_') === 0 && !in_array($key, $ignore_headers)) {
    $key = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($key, 5)))));
    $headers[$key] = $value;
  }
}
// Signal that the connection will be closed after completion of the response
$headers['Connection'] =  'close';

// Proxy request should pass on cookie headers to prevent Drupal from
// ending a session. Note: only if same host as this site!
if (!empty($_COOKIE) && $_SERVER['HTTP_HOST'] == parse_url($url, PHP_URL_HOST)) {
  $cookies = ''; $sep = '';
  foreach ($_COOKIE as $key => $value) {
    $cookies .= $sep . $key .'='. $value;
    $sep = '; ';
  }
  $headers['Cookie'] = $cookies;
}

// Now make request to target
$retry = 3; // nr of retries in case target is moved permanently or temporarily
if ($debug) echo 'make request'."<br/>\n";
while (true) {
  $result = new stdClass();
  
  // Parse the URL and make sure we can handle the schema.
  if ($debug) echo 'url = '. $url ."<br/>\n";
  $uri = parse_url($url);
  
  switch ($uri['scheme']) {
    case 'http':
      $port = isset($uri['port']) ? $uri['port'] : 80;
      $host = $uri['host'] . ($port != 80 ? ':'. $port : '');
      $fp = @fsockopen($uri['host'], $port, $errno, $errstr, 15);
      break;
    case 'https':
      // Note: Only works for PHP 4.3 compiled with OpenSSL.
      $port = isset($uri['port']) ? $uri['port'] : 443;
      $host = $uri['host'] . ($port != 443 ? ':'. $port : '');
      $fp = @fsockopen('ssl://'. $uri['host'], $port, $errno, $errstr, 20);
      break;
    default:
      header('HTTP/1.1 400 Bad Request');
      die('Invalid schema in url '. $url);
  }
  
  // Make sure the socket opened properly.
  if (!$fp) {
    // A network error occured.
    header('HTTP/1.1 503 Service Unavailable');
    die('Network error: '. $errstr .' ('. $errno . ')');
  }
  
  // Construct the path to act on.
  $path = isset($uri['path']) ? $uri['path'] : '/';
  if (isset($uri['query'])) {
    $path .= '?'. $uri['query'];
  }
  
  // Create HTTP request.
  $defaults = array(
    // RFC 2616: "non-standard ports MUST, default ports MAY be included".
    // We don't add the port to prevent from breaking rewrite rules checking the
    // host that do not take into account the port number.
    'Host' => 'Host: '. $host,
    'User-Agent' => 'User-Agent: Mapping kit (+http://aardbodem.nl/)',
    'Content-Length' => 'Content-Length: '. strlen($data)
  );
  
  // If the server url has a user then attempt to use basic authentication
  if (isset($uri['user'])) {
    $defaults['Authorization'] = 'Authorization: Basic '. base64_encode($uri['user'] . (!empty($uri['pass']) ? ":". $uri['pass'] : ''));
  }
  
  foreach ($headers as $header => $value) {
    $defaults[$header] = $header .': '. $value;
  }
  
  $request = $method .' '. $path ." HTTP/1.0\r\n";
  $request .= implode("\r\n", $defaults);
  $request .= "\r\n\r\n";
  if ($data) {
    $request .= $data ."\r\n";
  }
  $result->request = $request;
  
  fwrite($fp, $request);
  
  // Fetch response.
  $response = '';
  $count = 0;
  while (!feof($fp) && $chunk = fread($fp, 1024)) {
    if ($debug) echo 'chunk '. ++$count ."<br/>\n";
    
    if (! $result->data) {
      $response .= $chunk;
      
      // Parse response.
      list($split, $result->data) = explode("\r\n\r\n", $response, 2);
    }
    else {
      $result->data = &$chunk;
    }
    
    if ($result->data) {
      
      if (! $result->headers) {
        // Process header in $split
        $split = preg_split("/\r\n|\n|\r/", $split);
        // Get status from first line; often equal to 'HTTP/1.1 200 OK'
        list($protocol, $code, $text) = explode(' ', trim(array_shift($split)), 3);
        if ($debug) echo 'status line: '. $protocol .' '. $code .' '. $text ."<br/>\n";
        $result->headers = array();
        
        // Parse headers.
        while ($line = trim(array_shift($split))) {
          list($header, $value) = explode(':', $line, 2);
          if (isset($result->headers[$header]) && $header == 'Set-Cookie') {
            // RFC 2109: the Set-Cookie response header comprises the token Set-
            // Cookie:, followed by a comma-separated list of one or more cookies.
            $result->headers[$header] .= ','. trim($value);
          }
          else {
            $result->headers[$header] = trim($value);
          }
        }
        if ($debug) echo var_export($result->headers, true) ."<br/>\n";
        
        $responses = array(
          100 => 'Continue', 101 => 'Switching Protocols',
          200 => 'OK', 201 => 'Created', 202 => 'Accepted', 203 => 'Non-Authoritative Information', 204 => 'No Content', 205 => 'Reset Content', 206 => 'Partial Content',
          300 => 'Multiple Choices', 301 => 'Moved Permanently', 302 => 'Found', 303 => 'See Other', 304 => 'Not Modified', 305 => 'Use Proxy', 307 => 'Temporary Redirect',
          400 => 'Bad Request', 401 => 'Unauthorized', 402 => 'Payment Required', 403 => 'Forbidden', 404 => 'Not Found', 405 => 'Method Not Allowed', 406 => 'Not Acceptable', 407 => 'Proxy Authentication Required', 408 => 'Request Time-out', 409 => 'Conflict', 410 => 'Gone', 411 => 'Length Required', 412 => 'Precondition Failed', 413 => 'Request Entity Too Large', 414 => 'Request-URI Too Large', 415 => 'Unsupported Media Type', 416 => 'Requested range not satisfiable', 417 => 'Expectation Failed',
          500 => 'Internal Server Error', 501 => 'Not Implemented', 502 => 'Bad Gateway', 503 => 'Service Unavailable', 504 => 'Gateway Time-out', 505 => 'HTTP Version not supported'
        );
        
        // RFC 2616 states that all unknown HTTP codes must be treated the same as the
        // base code in their class.
        if (!isset($responses[$code])) {
          $code = floor($code / 100) * 100;
        }
        switch ($code) {
        case 301: // Moved permanently
        case 302: // Moved temporarily
        case 307: // Moved temporarily
          $location = $location || $result->headers['Location'];
          if ($retry-- > 0) {
            if ($debug) echo 'continue with location '. $result->headers['Location'] ."<br/>\n";
            $url = $result->headers['Location'];
            fclose($fp); // current connection can be closed
            continue 3; // continue with request for next location
          }
          // Make redirect_url point to first redirect location
          // @todo: what's the use of this?
          $result->redirect_url = $location;
          break;
        }
        
        // Check headers
        if (! empty($proxy_settings['permitted_content_types_regex'])) {
          $lowercase_headers = array_change_key_case($result->headers, CASE_LOWER);
          if (0 == preg_match($proxy_settings['permitted_content_types_regex'], $lowercase_headers['content-type'])) {
            header('HTTP/1.1 403 Forbidden');
            die('Content type not permitted');
          }
        }
        
        // Set return status.
        header($protocol .' '. $code .' '. $text);
        // Return headers to caller.
        foreach ($result->headers as $key => $value) {
          header($key .': '. $value, true);
        }
      }
      
      // Echo data (if not debugging)
      if (! $debug) echo $result->data;
    }
  }
  fclose($fp);
  break;
}
exit();
