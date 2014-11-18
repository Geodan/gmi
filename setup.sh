# Add any additional setup tasks here

# These tasks are run as root
CONF="/etc/postgresql/9.3/main/postgresql.conf"


# Restrict subnet to docker private network
echo "host    all             all             127.0.0.0/16               trust" >> /etc/postgresql/9.3/main/pg_hba.conf
# Listen on all ip addresses
echo "listen_addresses = '*'" >> /etc/postgresql/9.3/main/postgresql.conf
echo "port = 5432" >> /etc/postgresql/9.3/main/postgresql.conf

