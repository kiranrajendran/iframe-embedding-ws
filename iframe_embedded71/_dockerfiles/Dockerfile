FROM BUILDPROJECTFROMIMAGE
MAINTAINER  João Gameiro <jgameiro@pentaho.com>


# Dockerfile to work with CBF2
# This dockerfile assumes a certain structure. Don't change unless you know what
# you're doing
#
# If you want to override with a project specific dockerfile, you need to reuse
# these instructions

# Add the solution
ADD solution.zip /pentaho
RUN mv /pentaho/solution.zip /pentaho/*server*/pentaho-solutions/system/default-content/

#Add patches
ADD patches/ /pentaho/patches

RUN \
    sudo chown -R pentaho.pentaho /pentaho/patches && \
    cp -R /pentaho/patches/* /pentaho/*server*/ && \
    mkdir -p /home/pentaho/.kettle && \
    touch /home/pentaho/.kettle/kettle.properties && \
    echo MY_DATA_DIR=/pentaho/pentaho-server/tomcat/webapps/pentaho-style/data >> /home/pentaho/.kettle/kettle.properties 
	#&& \
	#echo KETTLE_JOB_LOG_DB=SampleData >> /home/pentaho/.kettle/kettle.properties && \
	#echo KETTLE_JOB_LOG_SCHEMA= >> /home/pentaho/.kettle/kettle.properties && \
	#echo KETTLE_JOB_LOG_TABLE=my_log_job >> /home/pentaho/.kettle/kettle.properties && \
	#echo KETTLE_TRANS_LOG_DB=SampleData >> /home/pentaho/.kettle/kettle.properties && \
	#echo KETTLE_TRANS_LOG_SCHEMA= >> /home/pentaho/.kettle/kettle.properties && \
	#echo KETTLE_TRANS_LOG_TABLE=my_log_trans >> /home/pentaho/.kettle/kettle.properties
		
#Add and install Community Test Editor
#ADD /dev/cte.zip /pentaho
#RUN unzip /pentaho/cte.zip -d /pentaho/*server*/pentaho-solutions/system/
#RUN rm /pentaho/cte.zip

# Change USER to root
    USER root

#Configure psql database
# Add the ddl file
#    ADD /dev/ddl.sql /pentaho
# Add the floormap_data dump file
    ADD /dev/floormap_data.zip /pentaho
    RUN unzip /pentaho/floormap_data.zip -d /pentaho/
# Give permissions to the user so that it can connect without using the password  
    RUN echo "host    all             all             all                 trust" >> /etc/postgresql/9.3/main/pg_hba.conf
 
# Start the database
# Create the database tables
    RUN /etc/init.d/postgresql start && \
	createdb  -U postgres floormap_data && \
	psql -f /pentaho/floormap_data.sql -h localhost -p 5432 -d floormap_data -U postgres
 


# Configure mondrian logs
RUN perl -ibak -p0e 's#(</log4j:configuration>)#   <category name="mondrian">      <priority value="DEBUG"/>   </category>   <category name="mondrian.sql">      <priority value="DEBUG"/>   </category><category name="mondrian.olap.fun"><priority value="INFO"/></category><category name="mondrian.rolap.NoCacheMemberReader"><priority value="INFO"/></category><category name="mondrian.i18n.LocalizingDynamicSchemaProcessor"><priority value="INFO"/></category><category name="mondrian.rolap.RolapConnection"><priority value="INFO"/></category><category name="mondrian.olap.ResultBase"><priority value="INFO"/></category><category name="mondrian.rolap.agg.AggregationManager"><priority value="INFO"/></category><category name="mondrian.rolap.SqlStatement"><priority value="INFO"/></category><category name="mondrian.olap.RoleImpl"><priority value="INFO"/></category><category name="mondrian.rolap.RolapMember"><priority value="INFO"/></category>$1#s' /pentaho/*server*/tomcat/webapps/pentaho/WEB-INF/classes/log4j.xml && \
 perl -ibak -p0e 's/(PENTAHOCONSOLE.*?value=.)(?:ERROR|INFO)/$1DEBUG/s' /pentaho/*server*/tomcat/webapps/pentaho/WEB-INF/classes/log4j.xml
 

#Set CTools Plugin properties
 RUN perl -ibak -p0e 's/<!--|-->//g' /pentaho/*server*/pentaho-solutions/system/pentaho-cdf-dd/plugin.xml && \
	sed -i.bak 's/<!--//g;s/-->//g' /pentaho/*server*/pentaho-solutions/system/cda/plugin.xml



# Allow fonts to be imported
RUN	perl -ibak -p0e 's#(<MimeTypeDefinitions>)#$1<MimeTypeDefinition mimeType="application/x-font-woff" hidden="true"><extension>woff</extension></MimeTypeDefinition><MimeTypeDefinition mimeType="application/vnd.ms-fontobject" hidden="false"><extension>eot</extension></MimeTypeDefinition><MimeTypeDefinition mimeType="application/x-font-otf" hidden="false"><extension>otf</extension></MimeTypeDefinition><MimeTypeDefinition mimeType="application/x-font-ttf" hidden="false"><extension>ttf</extension></MimeTypeDefinition>#s' /pentaho/*server*/pentaho-solutions/system/ImportHandlerMimeTypeDefinitions.xml && \
		perl -ibak -p0e 's/("org.pentaho.platform.plugin.services.importer.LocaleImportHandler".*?<value>xcdf<\/value>)/$1<value>eot<\/value><value>ttf<\/value><value>woff<\/value><value>otf<\/value>/s' /pentaho/*server*/pentaho-solutions/system/importExport.xml && \
		perl -ibak -p0e 's/("org.pentaho.platform.plugin.services.importexport.DefaultExportHandler".*?<value>.xcdf<\/value>)/$1<value>.eot<\/value><value>.ttf<\/value><value>.woff<\/value><value>.otf<\/value>/s' /pentaho/*server*/pentaho-solutions/system/importExport.xml && \
		perl -ibak -p0e 's/("convertersMap".*?"streamConverter"\/>)/$1<entry key="eot" value-ref="streamConverter"\/><entry key="ttf" value-ref="streamConverter"\/><entry key="woff" value-ref="streamConverter"\/><entry key="otf" value-ref="streamConverter"\/>/s' /pentaho/*server*/pentaho-solutions/system/importExport.xml

 

# Enable Pentaho Marketplace
RUN perl -ibak -p0e 's/pentaho-big-data-ee-plugin-osgi-obf/pentaho-big-data-ee-plugin-osgi-obf,pentaho-marketplace/' /pentaho/*server*/pentaho-solutions/system/karaf/etc/org.apache.karaf.features.cfg


