#
#	update_demos.py
#	refreshes wickk source in demos/ from current dist/
#

import json
import os

#-- acore

cmds = [
	'cp ../dist/wickk-0.1-dependencies.js ../demos/acore/js/wickk-0.1-dependencies.js',
	'cp ../dist/wickk-acore-0.1.min.js ../demos/acore/js/wickk-acore-0.1.min.js'
]

for cmd in cmds:
	os.system( cmd )

#-- vcore

cmds = [
	'cp ../dist/wickk-0.1-dependencies.js ../demos/vcore/js/wickk-0.1-dependencies.js',
	'cp ../dist/wickk-0.1.min.js ../demos/vcore/js/wickk-0.1.min.js'
]

for cmd in cmds:
	os.system( cmd )