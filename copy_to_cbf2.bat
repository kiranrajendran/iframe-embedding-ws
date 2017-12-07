REM C:\DOCS\Pentaho\cbf2\projects\iframe_embedded
SET src_dir="C:\Users\gnatali\Box Sync\Gianluca Natali\Workspaces\bitbucket\pentaho_cbf2_prj\iframe_embedded"
SET target_dir="C:\DOCS\Pentaho\cbf2\projects\iframe_embedded"
@RD /S /Q %target_dir%
if not exist %target_dir% mkdir %target_dir%
xcopy /s %src_dir% %target_dir%