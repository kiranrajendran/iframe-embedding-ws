REM If Server is running, stop it
REM for /F "tokens=3 delims=: " %%H in ('sc query "pentahoserver-3" ^| findstr "        STATE"') do (
REM  if /I "%%H" EQU "RUNNING" (
   REM Put your code you want to execute here
   REM For example, the following line
REM   net stop  pentahoserver-3
REM   )
REM )

SET src_dir="%~dp0iframe_embedded\_dockerfiles\patches\tomcat\webapps\pentaho_embedded"
SET target_dir="C:\Pentaho80\server\pentaho-server\tomcat\webapps\pentaho_embedded"
@RD /S /Q %target_dir%
if not exist %target_dir% mkdir %target_dir%
xcopy /s %src_dir% %target_dir%

REM net start  pentahoserver-3
