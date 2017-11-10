REM COPY TO NEW LOCAL SERVER
SET src_dir="C:\Users\gnatali\Box Sync\Gianluca Natali\Workspaces\bitbucket\pentaho_cbf2_prj\iframe_embedded_oob\_dockerfiles\patches\tomcat\webapps\pentaho_embedded"
SET target_dir="C:\Pentaho_71_2\server\pentaho-server\tomcat\webapps\pentaho_embedded"
@RD /S /Q %target_dir%
if not exist %target_dir% mkdir %target_dir%
xcopy /s %src_dir% %target_dir%