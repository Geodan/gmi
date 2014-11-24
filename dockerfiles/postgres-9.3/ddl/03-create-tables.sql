--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: gls; Type: SCHEMA; Schema: -; Owner: gls
--

CREATE SCHEMA gls;


ALTER SCHEMA gls OWNER TO gls;

SET search_path = gls, pg_catalog;

--
-- Name: addorgshist(); Type: FUNCTION; Schema: gls; Owner: gls
--

CREATE FUNCTION addorgshist() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$ 
  
  DECLARE
    l_timestamp timestamp with time zone = (SELECT now() AS timestamp); 
  BEGIN
    -- for DELETE commands.
    IF TG_OP = 'DELETE' THEN
        UPDATE orgs$his SET end_date = l_timestamp
        WHERE end_date IS NULL 
        AND id=OLD.id;
    END IF;
    -- for INSERT commands.
    IF TG_OP = 'INSERT' THEN
       INSERT INTO orgs$his (id,name,version,start_date,end_date)
       VALUES (NEW.id, NEW.name, (select COALESCE(max(version),0)+1 from orgs$his where id=NEW.id), l_timestamp, null);
    END IF;
    -- for UPDATE commands.
    IF TG_OP = 'UPDATE' THEN
       UPDATE orgs$his SET end_date = l_timestamp
       WHERE end_date IS NULL
       AND id = OLD.id;
       INSERT INTO orgs$his (id,name,version,start_date,end_date)
       VALUES (NEW.id, NEW.name, (select COALESCE(max(version),0)+1 from orgs$his where id = NEW.id), l_timestamp, null);
    END IF;

   RETURN NEW;

   END;$_$;


ALTER FUNCTION gls.addorgshist() OWNER TO gls;

--
-- Name: addtrackeeshist(); Type: FUNCTION; Schema: gls; Owner: gls
--

CREATE FUNCTION addtrackeeshist() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$ 
  DECLARE
    l_timestamp timestamp with time zone = (SELECT now() AS timestamp); 
  BEGIN
    -- for DELETE commands.
    IF TG_OP = 'DELETE' THEN
        UPDATE trackees$his SET end_date = l_timestamp
        WHERE end_date IS NULL 
        AND id=OLD.id;
    END IF;
    -- for INSERT commands.
    IF TG_OP = 'INSERT' THEN
       INSERT INTO trackees$his (id,name,orgid,version,start_date,end_date)
       VALUES (NEW.id, NEW.name,NEW.orgid, (select COALESCE(max(version),0)+1 from trackees$his where id=NEW.id), l_timestamp, null);
    END IF;
    -- for UPDATE commands.
    IF TG_OP = 'UPDATE' THEN
	    UPDATE trackees$his SET end_date = l_timestamp
		WHERE end_date IS NULL
		AND id=OLD.id;
		INSERT INTO trackees$his (id,name,orgid,version,start_date,end_date)
		VALUES (NEW.id, NEW.name,NEW.orgid, (select COALESCE(max(version),0)+1 from trackees$his where id=NEW.id), l_timestamp, null);
    END IF;
	
   RETURN NEW;
   
   END;$_$;


ALTER FUNCTION gls.addtrackeeshist() OWNER TO gls;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: eventcodes; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE eventcodes (
    eventcode bigint NOT NULL,
    description character varying(50)
);


ALTER TABLE gls.eventcodes OWNER TO gls;

--
-- Name: orgs; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE orgs (
    id bigint NOT NULL,
    name character varying(128) NOT NULL
);


ALTER TABLE gls.orgs OWNER TO gls;

--
-- Name: orgs$his; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE "orgs$his" (
    id bigint NOT NULL,
    name character varying(128) NOT NULL,
    version numeric(8,0) DEFAULT 1 NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone
);


ALTER TABLE gls."orgs$his" OWNER TO gls;

--
-- Name: orgs_id_seq; Type: SEQUENCE; Schema: gls; Owner: gls
--

CREATE SEQUENCE orgs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gls.orgs_id_seq OWNER TO gls;

--
-- Name: orgsettings; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE orgsettings (
    id integer NOT NULL,
    orgid bigint,
    kvp public.hstore
);


ALTER TABLE gls.orgsettings OWNER TO gls;

--
-- Name: orgsettings_id_seq; Type: SEQUENCE; Schema: gls; Owner: gls
--

CREATE SEQUENCE orgsettings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gls.orgsettings_id_seq OWNER TO gls;

--
-- Name: orgsettings_id_seq; Type: SEQUENCE OWNED BY; Schema: gls; Owner: gls
--

ALTER SEQUENCE orgsettings_id_seq OWNED BY orgsettings.id;


--
-- Name: positionlog; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE positionlog (
    id bigint NOT NULL,
    trackeeid bigint,
    event numeric(8,0) DEFAULT 0,
    track numeric(8,0),
    speed numeric(8,0),
    dop numeric(8,2),
    geocodedid numeric(18,0),
    geocodedname character varying(128),
    dtgps timestamp with time zone NOT NULL,
    dtreceived timestamp with time zone,
    geom public.geometry(Point,4326),
    kvp public.hstore,
    geom_snapped public.geometry(Point,4326)
);


ALTER TABLE gls.positionlog OWNER TO gls;

--
-- Name: positionlog_id_seq; Type: SEQUENCE; Schema: gls; Owner: gls
--

CREATE SEQUENCE positionlog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gls.positionlog_id_seq OWNER TO gls;

--
-- Name: positions; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE positions (
    trackeeid bigint NOT NULL,
    event numeric(8,0) DEFAULT 0,
    track numeric(8,0),
    speed numeric(8,0),
    dop numeric(8,2),
    geocodedid numeric(18,0),
    geocodedname character varying(128),
    dtgps timestamp with time zone NOT NULL,
    dtreceived timestamp with time zone,
    geom public.geometry(Point,4326),
    kvp public.hstore,
    geom_snapped public.geometry(Point,4326)
);


ALTER TABLE gls.positions OWNER TO gls;

--
-- Name: positions_289992; Type: VIEW; Schema: gls; Owner: gls
--

CREATE VIEW positions_289992 AS
    SELECT positions.trackeeid, positions.event, positions.track, positions.speed, positions.dop, positions.geocodedid, positions.geocodedname, positions.dtgps, positions.dtreceived, public.st_transform(positions.geom, 28992) AS st_transform FROM positions;


ALTER TABLE gls.positions_289992 OWNER TO gls;

--
-- Name: rayons_id_seq; Type: SEQUENCE; Schema: gls; Owner: gls
--

CREATE SEQUENCE rayons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gls.rayons_id_seq OWNER TO gls;

--
-- Name: trackees; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE trackees (
    id bigint NOT NULL,
    name character varying(128) NOT NULL,
    orgid bigint
);


ALTER TABLE gls.trackees OWNER TO gls;

--
-- Name: trackees$his; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE "trackees$his" (
    id bigint NOT NULL,
    name character varying(128) NOT NULL,
    orgid bigint,
    version numeric(8,0) DEFAULT 1 NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone
);


ALTER TABLE gls."trackees$his" OWNER TO gls;

--
-- Name: trackees_id_seq; Type: SEQUENCE; Schema: gls; Owner: gls
--

CREATE SEQUENCE trackees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gls.trackees_id_seq OWNER TO gls;

--
-- Name: userorgs; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE userorgs (
    userid bigint NOT NULL,
    orgid bigint NOT NULL
);


ALTER TABLE gls.userorgs OWNER TO gls;

--
-- Name: userroles; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE userroles (
    id bigint NOT NULL,
    name character varying(128) NOT NULL
);


ALTER TABLE gls.userroles OWNER TO gls;

--
-- Name: userroles_seq; Type: SEQUENCE; Schema: gls; Owner: gls
--

CREATE SEQUENCE userroles_seq
    START WITH 100
    INCREMENT BY 10
    MINVALUE 100
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gls.userroles_seq OWNER TO gls;

--
-- Name: users; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE users (
    id bigint NOT NULL,
    name character varying(128) NOT NULL,
    role bigint DEFAULT 0 NOT NULL,
    passwordprefix character varying(20),
    hashedpassword character varying(60)
);


ALTER TABLE gls.users OWNER TO gls;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: gls; Owner: gls
--

CREATE SEQUENCE users_id_seq
    START WITH 100
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gls.users_id_seq OWNER TO gls;

--
-- Name: wegvakken; Type: TABLE; Schema: gls; Owner: gls; Tablespace: 
--

CREATE TABLE wegvakken (
    wvk_id bigint NOT NULL,
    wegnummer character varying(5),
    wegnum numeric(3,0),
    wegnum_z numeric(3,0),
    rpe_code character varying(1),
    hecto_lttr character varying(1),
    imweg numeric(1,0),
    imweg_unity numeric(1,0),
    wegtype character varying(1),
    wegbehsrt character varying(1),
    stt_naam character varying(29),
    wpsnaamnen character varying(24),
    gme_naam character varying(24),
    begafstand numeric(5,0),
    endafstand numeric(5,0),
    beginkm numeric(7,3),
    eindkm numeric(7,3),
    wvk_begdat timestamp without time zone,
    geom_wgs84 public.geometry(LineString,4326),
    geom_rd public.geometry(LineString,28992)
);


ALTER TABLE gls.wegvakken OWNER TO gls;

--
-- Name: id; Type: DEFAULT; Schema: gls; Owner: gls
--

ALTER TABLE ONLY orgsettings ALTER COLUMN id SET DEFAULT nextval('orgsettings_id_seq'::regclass);


--
-- Name: eventcodes_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY eventcodes
    ADD CONSTRAINT eventcodes_pkey PRIMARY KEY (eventcode);


--
-- Name: orgs$his_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY "orgs$his"
    ADD CONSTRAINT "orgs$his_pkey" PRIMARY KEY (id, version);


--
-- Name: orgs_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY orgs
    ADD CONSTRAINT orgs_pkey PRIMARY KEY (id);


--
-- Name: orgssettings_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY orgsettings
    ADD CONSTRAINT orgssettings_pkey PRIMARY KEY (id);


--
-- Name: positionlog_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY positionlog
    ADD CONSTRAINT positionlog_pkey PRIMARY KEY (id);


--
-- Name: positions_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (trackeeid);


--
-- Name: trackees$his_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY "trackees$his"
    ADD CONSTRAINT "trackees$his_pkey" PRIMARY KEY (id, version);


--
-- Name: trackees_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY trackees
    ADD CONSTRAINT trackees_pkey PRIMARY KEY (id);


--
-- Name: userorgs_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY userorgs
    ADD CONSTRAINT userorgs_pkey PRIMARY KEY (userid, orgid);


--
-- Name: userroles_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY userroles
    ADD CONSTRAINT userroles_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wegvakken_pkey; Type: CONSTRAINT; Schema: gls; Owner: gls; Tablespace: 
--

ALTER TABLE ONLY wegvakken
    ADD CONSTRAINT wegvakken_pkey PRIMARY KEY (wvk_id);


--
-- Name: ix_eventcodes_ak1; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX ix_eventcodes_ak1 ON eventcodes USING btree (eventcode, description);


--
-- Name: ix_orgs$his_dates; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX "ix_orgs$his_dates" ON "orgs$his" USING btree (start_date, end_date);


--
-- Name: ix_positionlog_dt; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX ix_positionlog_dt ON positionlog USING btree (dtgps);


--
-- Name: ix_positionlog_tid_dtgps; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX ix_positionlog_tid_dtgps ON positionlog USING btree (trackeeid, dtgps);


--
-- Name: ix_positionlog_trackeeid; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX ix_positionlog_trackeeid ON positionlog USING btree (trackeeid);


--
-- Name: ix_trackees$his_ak1; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX "ix_trackees$his_ak1" ON "trackees$his" USING btree (id, name);


--
-- Name: ix_trackees$his_dates; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX "ix_trackees$his_dates" ON "trackees$his" USING btree (start_date, end_date);


--
-- Name: ix_trackees$his_id_enddate; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX "ix_trackees$his_id_enddate" ON "trackees$his" USING btree (id, end_date);


--
-- Name: ix_trackees_ak1; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX ix_trackees_ak1 ON trackees USING btree (id, name);


--
-- Name: ix_trackees_ino; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE UNIQUE INDEX ix_trackees_ino ON trackees USING btree (id, name, orgid);


--
-- Name: ix_wegvakken_im; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX ix_wegvakken_im ON wegvakken USING btree (imweg);


--
-- Name: ix_wegvakken_tnbe; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX ix_wegvakken_tnbe ON wegvakken USING btree (wegtype, wegnum, beginkm, eindkm);


--
-- Name: ix_wegvakken_zr; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX ix_wegvakken_zr ON wegvakken USING btree (wegnum_z, rpe_code);


--
-- Name: pk_cars; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE UNIQUE INDEX pk_cars ON trackees USING btree (id);


--
-- Name: positionlog_idx; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX positionlog_idx ON positionlog USING gist (geom);


--
-- Name: positionlog_pid_tid; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX positionlog_pid_tid ON positionlog USING btree (id, trackeeid);


--
-- Name: positions_idx; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX positions_idx ON positions USING gist (geom);


--
-- Name: trackees$his_orgid; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX "trackees$his_orgid" ON "trackees$his" USING btree (orgid);


--
-- Name: trackees_orgid; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX trackees_orgid ON trackees USING btree (orgid);


--
-- Name: uq_orgs_name; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE UNIQUE INDEX uq_orgs_name ON orgs USING btree (upper((name)::text));


--
-- Name: uq_trackees$his_name; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX "uq_trackees$his_name" ON "trackees$his" USING btree (upper((name)::text));


--
-- Name: uq_trackees_name; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE UNIQUE INDEX uq_trackees_name ON trackees USING btree (upper((name)::text));


--
-- Name: uq_userroles_name; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE UNIQUE INDEX uq_userroles_name ON userroles USING btree (upper((name)::text));


--
-- Name: uq_users_name; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE UNIQUE INDEX uq_users_name ON users USING btree (upper((name)::text));


--
-- Name: wegvakken_idx; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX wegvakken_idx ON wegvakken USING gist (geom_wgs84);


--
-- Name: wegvakken_rd_idx; Type: INDEX; Schema: gls; Owner: gls; Tablespace: 
--

CREATE INDEX wegvakken_rd_idx ON wegvakken USING gist (geom_rd);


--
-- Name: creaorgshist; Type: TRIGGER; Schema: gls; Owner: gls
--

CREATE TRIGGER creaorgshist BEFORE INSERT OR DELETE OR UPDATE ON orgs FOR EACH ROW EXECUTE PROCEDURE addorgshist();


--
-- Name: creatrackeeshist; Type: TRIGGER; Schema: gls; Owner: gls
--

CREATE TRIGGER creatrackeeshist BEFORE INSERT OR DELETE OR UPDATE ON trackees FOR EACH ROW EXECUTE PROCEDURE addtrackeeshist();


--
-- Name: fk_orgsettings_orgs; Type: FK CONSTRAINT; Schema: gls; Owner: gls
--

ALTER TABLE ONLY orgsettings
    ADD CONSTRAINT fk_orgsettings_orgs FOREIGN KEY (orgid) REFERENCES orgs(id);


--
-- Name: fk_positions_trackees; Type: FK CONSTRAINT; Schema: gls; Owner: gls
--

ALTER TABLE ONLY positions
    ADD CONSTRAINT fk_positions_trackees FOREIGN KEY (trackeeid) REFERENCES trackees(id) MATCH FULL;


--
-- Name: fk_trackees_orgs; Type: FK CONSTRAINT; Schema: gls; Owner: gls
--

ALTER TABLE ONLY trackees
    ADD CONSTRAINT fk_trackees_orgs FOREIGN KEY (orgid) REFERENCES orgs(id) MATCH FULL;


--
-- Name: userorgs_orgid_fkey; Type: FK CONSTRAINT; Schema: gls; Owner: gls
--

ALTER TABLE ONLY userorgs
    ADD CONSTRAINT userorgs_orgid_fkey FOREIGN KEY (orgid) REFERENCES orgs(id);


--
-- Name: userorgs_userid_fkey; Type: FK CONSTRAINT; Schema: gls; Owner: gls
--

ALTER TABLE ONLY userorgs
    ADD CONSTRAINT userorgs_userid_fkey FOREIGN KEY (userid) REFERENCES users(id);


--
-- Name: gls; Type: ACL; Schema: -; Owner: gls
--

REVOKE ALL ON SCHEMA gls FROM PUBLIC;
REVOKE ALL ON SCHEMA gls FROM gls;
GRANT ALL ON SCHEMA gls TO gls;
GRANT ALL ON SCHEMA gls TO olaf;


--
-- Name: wegvakken; Type: ACL; Schema: gls; Owner: gls
--

REVOKE ALL ON TABLE wegvakken FROM PUBLIC;
REVOKE ALL ON TABLE wegvakken FROM gls;
GRANT ALL ON TABLE wegvakken TO gls;
GRANT ALL ON TABLE wegvakken TO olaf;


--
-- PostgreSQL database dump complete
--

