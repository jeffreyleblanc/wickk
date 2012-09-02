#
#	WickkSourceManipulators.py
#	simple tool to help generate minimized distributions files from src/
#

import json
import os
import re

# File/String ========================================================

def File2String(fpath):
	try:
		return open(fpath, 'r').read()
	except:
		print 'ERROR opening '+fpath
		exit()
		
def String2File(str, fpath, action='w'):
	try:
		open(fpath, action).write(str)
	except:
		print 'ERROR writing to '+fpath
		exit()

# JSON ========================================================
		
def File2Json(fpath):
	try:
		return json.loads( open(fpath, 'r').read() )
	except:
		print 'ERROR opening '+fpath
		exit()
	
#-- Json2File ?

# Minify ========================================================

def minifyFile(filePath):
	gYuiCompressorPath = 'lib/yuicompressor-2.4.7.jar'
	if not os.path.exists(gYuiCompressorPath):
		print 'ERROR : minifyFile : Can not find compressor jar'
	cmd = 'java -jar '+gYuiCompressorPath+' '+filePath+' -o '+filePath
	os.system(cmd)
	

# Obscure ========================================================

def obscureFile( obscureDict, targetFile ):
	Source = File2String(targetFile)
	if type(obscureDict) != type([]):
		obscureDict = File2Json(obscureDict)
	for entry in obscureDict:
		Source = re.sub(entry[0],entry[1],Source)
	String2File( Source, targetFile, "w" )
	
def obscureString( obscureDict, str ):
	Source = str
	if type(obscureDict) != type([]):
		obscureDict = File2Json(obscureDict)
	for entry in obscureDict:
		Source = re.sub(entry[0],entry[1],Source)
	return Source
	
def applyObscureBetween(src, begin, end, obscureDict ):
	result = getBetween( src, begin, end )
	if result != None:
		found = result.group(0)
		obscured = obscureString( obscureDict, found )
		return replaceBetween( src, begin, end, obscured )
	
# Replacers ========================================================

def replaceBetween( str, bMark, eMark, replacement ):
	return re.sub('(?<='+bMark+')(.*?)(?='+eMark+')', replacement ,str , flags=re.DOTALL )

#-- Gets rid of the Marks as well
def replaceBetweenAND( str, bMark, eMark, replacement ):
	return re.sub(bMark+'(.*?)'+eMark, replacement ,str , flags=re.DOTALL )
	
def getBetween( str, bMark, eMark ):
	return re.search('(?<='+bMark+')(.*?)(?='+eMark+')' ,str , flags=re.DOTALL )
	
def clearTabAndNewline( str ):
	return re.sub('\t|\n','',str)

def clearDoubleSlashComments( str ):
	return re.sub('[^:]//(.*?)(\n|\Z)','',str, flags=re.DOTALL)

# Merger ========================================================
	
#-- helper function
def dirStructureToList( jsonFile ):
	fileList = []
	json = File2Json( jsonFile )
	for topdir, sub in json.iteritems():
		for L in sub:
			if type(L) == type({}):
				for subdir, list in L.iteritems():
					for file in list:
						fileList.append( str(topdir)+str(subdir)+str(file) )
	return fileList
	
def filterList( list, filter ):
	fileList = []
	for f in list:
		if f.find(filter) < 0:
			fileList.append( f )
	return fileList


def mergeFilesIntoString( fileList ):
	
	mergedSource = ''
	if type(fileList) != type([]):
		fileList = dirStructureToList( fileList )
	
	for file in fileList:
		mergedSource += unicode( File2String(file), errors='ignore') + '\n'
	return mergedSource
	
def mergeFilesIntoFile( mergeFilesPath, outputPath, outputPathAction ):

	String2File( mergeFilesIntoString( mergeFilesPath ), outputPath, outputPathAction )