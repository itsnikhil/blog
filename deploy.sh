#!/bin/sh

# if [ "`git status -s`" ]
# then
#     echo "The working directory is dirty. Please commit any pending changes."
#     exit 1;
# fi

echo "Deleting old publication"
rm -rf public

echo "Generating site"
hugo

echo "Updating master branch"
cd public

echo "Configuring git"
git config --global push.default matching
git config --global user.email "${GitHubEMail}"
git config --global user.name "${GitHubUser}"

echo "Add changes to git"
git add .

if [ -n "$*" ]; then
	msg="$*"
fi

echo "Commit changes"
msg="rebuilding site $(date)"


echo "Pushing to github"
git push https://${GitHubKEY}@github.com/${GitHubUser}/${GitHubRepo}.git master