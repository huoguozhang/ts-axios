const shell = require('shelljs')
shell.exec('git add .');
shell.exec("git commit -m 'autocommit'")
shell.exec('git push')
