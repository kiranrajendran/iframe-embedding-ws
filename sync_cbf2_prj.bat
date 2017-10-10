REM C:\DOCS\Pentaho\cbf2\projects\iframe_embedded
SET src_dir="C:\Users\gnatali\Box Sync\Gianluca Natali\Workspaces\bitbucket\pentaho_cbf2_prj\iframe_embedded"
SET target_dir="C:\DOCS\Pentaho\cbf2\projects\iframe_embedded"
@RD /S /Q %target_dir%
if not exist %target_dir% mkdir %target_dir%
xcopy /s %src_dir% %target_dir%


REM Copy to my local tomcat
for /F "tokens=3 delims=: " %%H in ('sc query "pentahoserver-1" ^| findstr "        STATE"') do (
  if /I "%%H" EQU "RUNNING" (
   REM Put your code you want to execute here
   REM For example, the following line
   net stop  pentahoserver-1
  )
)

SET src_dir="C:\Users\gnatali\Box Sync\Gianluca Natali\Workspaces\bitbucket\pentaho_cbf2_prj\iframe_embedded\_dockerfiles\patches\tomcat\webapps\pentaho_embedded"
SET target_dir="C:\Pentaho_7_1\server\pentaho-server\tomcat\webapps\pentaho_embedded"
@RD /S /Q %target_dir%
if not exist %target_dir% mkdir %target_dir%
xcopy /s %src_dir% %target_dir%

REM Replace 8080 with 8081
powershell -Command "(gc 'C:\Pentaho_7_1\server\pentaho-server\tomcat\webapps\pentaho_embedded\assets\js\pentaho_embedded.js') -replace 'http://localhost:8080/pentaho', 'http://localhost:8081/pentaho' | Out-File 'C:\Pentaho_7_1\server\pentaho-server\tomcat\webapps\pentaho_embedded\assets\js\pentaho_embedded.js'"

net start  pentahoserver-1