#
#	export_src.py
#	simple tool to help generate minimized distributions files from src/
#

# pull out output title ( 'thexel-' )

import json
import os

# Globals ========================================================

makeFile = 	'make.json'

targetPaths = [ '../../phycore/dep/', '../../trees/dep/', '../../clouds/dep/' ]

# Helpers ========================================================
		
def File2Json(fpath):
	try:
		return json.loads( open('make.json', 'r').read() )
	except:
		print 'ERROR opening '+fpath
		exit()

# Process ========================================================

#-- Load the makeFile
j = File2Json(makeFile)

#-- Iterate over cores
for core in j['cores']:
	corename = core["core"]
	print 'rsync on : '+corename+'...'
	
	for tgt in targetPaths:
		cmd = 'rsync -avz ../src/'+corename + ' ' + tgt
		os.system(cmd)
