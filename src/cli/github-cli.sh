# Clone & open
gh alias set clone '!gh repo clone $1 "$(basename $1)" && code "$(basename $1)"'

# Fork & clone & open
gh alias set fork '!gh repo fork $1 --clone "$(basename $1)" && code "$(basename $1)"'

# Push & open PR
gh alias set pullrequest '!git push -u && gh pr create -w --repo "$(git remote get-url upstream)"'

# Delete remote & local
gh alias set rm '!gh repo delete $1 --confirm && rm -rf $1'
