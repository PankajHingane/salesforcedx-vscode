---
title: Org Development Model with VS Code
---

The latest release of the Salesforce Extensions for VS Code and the Salesforce CLI added a preview of basic support for developing against non-scratch orgs. This means you can now use VS Code with your `package.xml` file against Scratch Orgs, Developer Edition Orgs, etc. This release is limited in functionality as it is a preview and we suggest you only use it to evaluate features and provide us with [feedback](#bugs-and-feedback) - it is not recommended to use in your day to day work yet.

![Demo](/images/changeset-demo.gif)

> NOTE: The functionality discussed in this document is a preview and isn’t part of the “Services” under your master subscription agreement with Salesforce. Use this feature at your sole discretion, and make your purchase decisions only on the basis of generally available products and features. Salesforce doesn’t guarantee general availability of this feature within any particular time frame or at all, and we can discontinue it at any time. This feature is for evaluation purposes only, not for production use. It’s offered as is and isn’t supported, and Salesforce has no liability for any harm or damage arising out of or in connection with it. All restrictions, Salesforce reservation of rights, obligations concerning the Services, and terms for related Non-Salesforce Applications and Content apply equally to your use of this feature. You can provide feedback and suggestions by [opening Github Issues](https://github.com/forcedotcom/salesforcedx-vscode/issues/new/choose).

## Preview Setup

Before you can use the features discussed in this article you will need to install the preview release of the Salesforce CLI and enable the preview features in VS Code. You can do this by running the following commands.

```
sfdx plugins:install salesforcedx@pre-release
```

> NOTE: When you are done testing out these features you will need go back to the stable release of the CLI using the following command.

```
sfdx plugins:install salesforcedx
```

Next you need to enable the feature in VS Code.

To open your user and workspace settings, use the following VS Code menu command:

On Windows/Linux - **File > Preferences > Settings**  
On macOS - **Code > Preferences > Settings**

Set the following setting in your user settings.

```
"salesforcedx-vscode-core.change_set_based_tools.enabled": true
```

Close and reopen Visual Studio Code.

## Getting Started

First, Open VS Code and create a project. To create a project with a manifest run the command `SFDX: Create Project with Manifest`.

![Create project](/images/create-project-with-manifest.png)

> Alternatively you can use the CLI to create the project.

```
sfdx force:project:create --projectname myproject --manifest
cd mychangeset
code .
```

For the preview you will need to change a setting to force the commands to work against API version 43. Inside of VS Code run the following in the integrated terminal.

```
sfdx force:config:set apiVersion=43.0
```

Next, you will need to authorize the org you will be working with.

If you want to connect to a sandbox org, edit your `sfdx-project.json` file to set `sfdcLoginUrl` to `https://test.salesforce.com` before you authorize the org.

To start the login process, run the command `SFDX: Authorize an Org`.

![Authorize an Org](/images/authorize-org-command.png)

Your browser will open and you can login to your Sandbox, Developer Edition, trial, etc. Once you have authenticated, you can close the browser and return to VS Code.

The new project you created came with a default manifest file located at `manifest/package.xml`. Right-click this file and select the command `SFDX: Retrieve Source from Org`

![Retrieve source from org](/images/retrieve-source-from-org.png)

After you make code changes, you can deploy these changes to your org by running the `SFDX: Deploy to Org` command on either:

1. A manifest file.
2. A folder
3. A file

![Deploy source to org](/images/deploy-source-to-org.png)

## Source Format

Note, that the format of the source code is in the new "source" format. This means that you cannot open your existing code from Force.com IDE in VS Code. You either need to convert your code to source format or create a new project and retrieve the code from your org using your existing manifest (`package.xml`) file.

For information on converting to source format and maintaining git history see [this blog post](https://ntotten.com/2018/05/11/convert-metadata-to-source-format-while-maintain-git-history/).

## Bugs and Feedback

To report issues with these features or for anything else related to the Salesforce Extensions for VS Code, open a [bug on GitHub](https://github.com/forcedotcom/salesforcedx-vscode/issues/new?template=Bug_report.md). If you would like to suggest a feature, create a [feature request on Github](https://github.com/forcedotcom/salesforcedx-vscode/issues/new?template=Feature_request.md).
