#
#	make_dist.py
#	populates the dist/ directory with source compressed to single files
#

from WickkSourceManipulators import *

#-- Clear dist ----------------------------------#

os.system( 'rm -r ../dist/*' )

#-- Lib Support -----------------------------#

OUTJS = '../dist/wickk-0.1-dependencies.js'
src = File2String("../src/libs/jquery.min.1.7.1.js")
src += File2String("../src/libs/dump.js")
String2File(src, OUTJS)
minifyFile( OUTJS )

#-- Javascript ----------------------------#

#-- get full file list
fileList = [ 'files/_WickkLicense.js' ]
fileList += dirStructureToList("files/wickkcore-files.json" )
fileList = filterList( fileList, "_license.js" )
#-- uncompressed full
mergeFilesIntoFile( fileList, '../dist/wickk-0.1.js', "w" )
#-- compressed full
src = File2String('../dist/wickk-0.1.js')
String2File(src, '../dist/wickk-0.1.min.js')
minifyFile( '../dist/wickk-0.1.min.js' )

#-- make acore only list
acoreFileList = [ 'files/_WickkLicense.js' ]
for file in fileList:
	if file.find('acore') > -1:
		acoreFileList.append( file )
#-- uncompressed acore
mergeFilesIntoFile( fileList, '../dist/wickk-acore-0.1.js', "w" )
#-- compressed acore
src = File2String('../dist/wickk-acore-0.1.js')
String2File(src, '../dist/wickk-acore-0.1.min.js')
minifyFile( '../dist/wickk-acore-0.1.min.js' )

#-- Include Helper ---------------------------#

html = ''
scrptB = '<script src="'
scrptE = '"></script>'

#-- full
html = ''
html += scrptB+'src/libs/jquery.min.1.7.1.js'+scrptE+'\n'
html += scrptB+'src/libs/dump.js'+scrptE+'\n\n'
for file in fileList:
	html += (scrptB+file+scrptE).replace('../','') +'\n'
String2File(html, '../dist/wickk-0.1-includes.html')

#-- acore
html = ''
html += scrptB+'src/libs/jquery.min.1.7.1.js'+scrptE+'\n'
html += scrptB+'src/libs/dump.js'+scrptE+'\n\n'
for file in acoreFileList:
	html += (scrptB+file+scrptE).replace('../','') +'\n'
String2File(html, '../dist/wickk-acore-0.1-includes.html')




