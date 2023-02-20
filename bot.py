import os
from github import Github

# First, authenticate with GitHub using a personal access token
ACCESS_TOKEN = os.environ.get('GITHUB_ACCESS_TOKEN')
g = Github(ACCESS_TOKEN)

# Get the repository and the pull request
REPO_NAME = 'Click-The-Edible-Game'
OWNER_NAME = 'Rakesh9100'
repo = g.get_repo(f'{OWNER_NAME}/{REPO_NAME}')
pull_requests = repo.get_pulls(state='closed', sort='updated', base='master')
pr = pull_requests[0]  # Assumes most recent pull request

# Check if the pull request has been merged
if pr.merged:

    # Get the username of the person who made the pull request
    pr_user = pr.user.login

    # Add a comment to the pull request with a custom message
    message = f'Thank you @{pr_user} for your valuable contribution. Your PR has been merged successfully!! 🎉'
    pr.create_issue_comment(message)
