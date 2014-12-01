-- model_wildfire
CREATE SCHEMA model_wildfire
  AUTHORIZATION postgres;

GRANT ALL ON SCHEMA model_wildfire TO postgres;
GRANT ALL ON SCHEMA model_wildfire TO public;

-- top10nl
CREATE SCHEMA top10nl
  AUTHORIZATION tomt;

GRANT ALL ON SCHEMA top10nl TO tomt;
GRANT USAGE ON SCHEMA top10nl TO public;

-- dems
CREATE SCHEMA dems
  AUTHORIZATION tomt;

COMMENT ON SCHEMA dems
  IS 'Digital elevation models (e.g. AHN)';


