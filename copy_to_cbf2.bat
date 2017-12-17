REM C:\DOCS\Pentaho\cbf2\projects\iframe_embedded
SET src_dir="%~dp0iframe_embedded"
SET target_dir="C:\DOCS\Pentaho\cbf2\projects\peps_master"
@RD /S /Q %target_dir%
if not exist %target_dir% mkdir %target_dir%
xcopy /s %src_dir% %target_dir%