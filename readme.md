# JCDN

## Overview

JCDN stores static style and font assets that are consumed as a shared bundle by
other projects in this workspace.

## Structure

* `styles/` and `style/` keep stylesheet assets and compatibility paths
* `fonts/` and `font/` keep font assets and compatibility paths
* root config files describe package metadata and sync behavior

## Notes

* The repository is asset-focused and does not expose a large runtime surface.
* Deployment endpoints and hosting details are intentionally excluded.
