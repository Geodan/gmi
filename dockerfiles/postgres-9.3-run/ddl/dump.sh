echo password=modeluser
#run outside of vm and load from outside vm with a local psql to host vm 
pg_dump --host 192.168.40.5 --port 3389 --username modeluser -W --encoding UTF8 --file top10nl.sql --schema top10nl research
pg_dump --host 192.168.40.5 --port 3389 --username modeluser -W --encoding UTF8 --file administration.sql --schema administration research
pg_dump --host 192.168.40.5 --port 3389 --username modeluser -W --encoding UTF8 --file corine.sql --schema corine research
pg_dump --host 192.168.40.5 --port 3389 --username modeluser -W --encoding UTF8 --file schemas.sql --schema-only  research
