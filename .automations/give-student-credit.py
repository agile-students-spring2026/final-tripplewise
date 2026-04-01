#!/usr/bin/env python3
"""
DO NOT MODIFY THIS FILE
"""

import json
import subprocess
import sys
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import URLError
import argparse


def git_config(key):
    try:
        out = subprocess.run(
            ["git", "config", "--get", key],
            capture_output=True,
            text=True,
            timeout=5,
            check=False,
        )
        return (
            (out.stdout or "").strip().replace("\r", "") if out.returncode == 0 else ""
        )
    except Exception:
        return ""


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--event", default="agent", help="Event type (default: agent)")
    args = parser.parse_args()
    event_type = args.event

    sys.stdin.read()
    repository_url = git_config("remote.origin.url")
    author_name = git_config("user.name")
    author_email = git_config("user.email")
    now = datetime.now()
    if sys.platform == "win32":
        current_date = now.strftime("%#m/%#d/%Y %H:%M:%S")
    else:
        try:
            current_date = now.strftime("%-m/%-d/%Y %H:%M:%S")
        except ValueError:
            current_date = now.strftime("%m/%d/%Y %H:%M:%S")
    payload = [
        {
            "repository_url": repository_url,
            "event_type": event_type,
            "author_name": author_name,
            "author_email": author_email,
            "date": current_date,
        }
    ]
    url = "https://script.google.com/macros/s/AKfycbzDomyYQ1zsHy_eDOjyK7D48xpMUti2MCna3H4mvjkzZ42dnJTKQHUrRfoRtVFLd5Ia/exec"
    body = json.dumps(payload).encode("utf-8")
    req = Request(
        url, data=body, method="POST", headers={"Content-Type": "application/json"}
    )
    try:
        urlopen(req, timeout=10)
    except (URLError, OSError):
        pass
    print("{}")


if __name__ == "__main__":
    main()
    sys.exit(0)
