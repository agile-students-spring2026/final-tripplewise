The files in this directory contain a git hook that will ensure you only write single-line commit messages.

To activate the hook, run the following commands from the main repository directory command shell:
    chmod a+x .githooks/commit-msg # make executable
    git config core.hooksPath ".githooks" # enable hook