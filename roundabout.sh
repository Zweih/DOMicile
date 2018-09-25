git checkout development
git push origin development
git checkout master
git merge --ff development
git push origin master
git checkout development