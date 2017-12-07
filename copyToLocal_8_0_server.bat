REM If Server is running, stop it
for /F "tokens=3 delims=: " %%H in ('sc query "pentahoserver-3" ^| findstr "        STATE"') do (
  if /I "%%H" EQU "RUNNING" (
   REM Put your code you want to execute here
   REM For example, the following line
   net stop  pentahoserver-3
  )
)

SET src_dir="C:\Users\gnatali\Box Sync\Gianluca Natali\Workspaces\bitbucket\pentaho_cbf2_prj\iframe_embedded\_dockerfiles\patches\tomcat\webapps\pentaho_embedded"
SET target_dir="C:\Pentaho80\server\pentaho-server\tomcat\webapps\pentaho_embedded"
@RD /S /Q %target_dir%
if not exist %target_dir% mkdir %target_dir%
xcopy /s %src_dir% %target_dir%

REM net start  pentahoserver-3
