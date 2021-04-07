import { OAuth } from '../oauth.js';
import pkg from 'forge-apis';
import { config } from '../../config.js';
const { UserProfileApi, HubsApi, ProjectsApi, FoldersApi, ItemsApi } = pkg;
const WSP_HUB_ID = 'b.8a331102-468b-4ecd-a5c3-64c7b5c855ab';

export const forgeCallbackRoute = async (req, res) => {
  const { code } = req.query;
  const oauth = new OAuth(req.session);

  try {
    await oauth.setCode(code);
    res.redirect('http://localhost:3000/models');
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getUrl = async (req, res) => {
  const url =
    'https://developer.api.autodesk.com' +
    '/authentication/v1/authorize?response_type=code' +
    '&client_id=' +
    config.credentials.client_id +
    '&redirect_uri=' +
    config.credentials.callback_url +
    '&scope=' +
    config.scopes.internal.join(' ');
  res.end(url);
};

export const logout = async (req, res) => {
  req.session = null;
  res.redirect('back');
};

export const getUserProfile = async (req, res) => {
  try {
    const oauth = new OAuth(req.session);
    const internalToken = await oauth.getInternalToken();
    const user = new UserProfileApi();
    const profile = await user.getUserProfile(oauth.getClient(), internalToken);
    res.json({
      name: profile.body.firstName + ' ' + profile.body.lastName,
      picture: profile.body.profileImages.sizeX40,
    });
  } catch (error) {
    res.json(error);
  }
};

export const listProjects = async (req, res, next) => {
  const href = decodeURIComponent(req.query.id);

  if (href === '') {
    res.status(500).end();
    return;
  }
  // Get the access token
  try {
    const oauth = new OAuth(req.session);
    const internalToken = await oauth.getInternalToken();

    if (href === '#') {
      getHubs(oauth.getClient(), internalToken, res);
    } else {
      const params = href.split('/');
      const resourceName = params[params.length - 2];
      const resourceId = params[params.length - 1];
      switch (resourceName) {
        case 'hubs':
          getProjects(resourceId, oauth.getClient(), internalToken, res);
          break;
        case 'projects':
          // For a project, first we need the top/root folder
          const hubId = params[params.length - 3];
          getFolders(hubId, resourceId /*project_id*/, oauth.getClient(), internalToken, res);
          break;
        case 'folders': {
          const projectId = params[params.length - 3];
          getFolderContents(
            projectId,
            resourceId /*folder_id*/,
            oauth.getClient(),
            internalToken,
            res
          );
          break;
        }
        case 'items': {
          const projectId = params[params.length - 3];
          getVersions(projectId, resourceId /*item_id*/, oauth.getClient(), internalToken, res);
          break;
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

async function getHubs(oauthClient, credentials, res) {
  try {
    const hubs = new HubsApi();
    const result = await hubs.getHubs({}, oauthClient, credentials);
    res.json(
      result.body.data.map((hub) => {
        let hubType;
        switch (hub.attributes.extension.type) {
          case 'hubs:autodesk.core:Hub':
            hubType = 'hubs';
            break;
          case 'hubs:autodesk.a360:PersonalHub':
            hubType = 'personalHub';
            break;
          case 'hubs:autodesk.bim360:Account':
            hubType = 'bim360Hubs';
            break;
        }
        return createOutput(hub.links.self.href, hub.attributes.name, hubType, true);
      })
    );
  } catch (err) {
    res.json(err);
  }
}

async function getProjects(hubId, oauthClient, credentials, res) {
  try {
    const projects = new ProjectsApi();
    const data = await projects.getHubProjects(hubId, {}, oauthClient, credentials);
    res.json(
      data.body.data.map((project) => {
        let projectType = 'projects';
        switch (project.attributes.extension.type) {
          case 'projects:autodesk.core:Project':
            projectType = 'a360projects';
            break;
          case 'projects:autodesk.bim360:Project':
            projectType = 'bim360projects';
            break;
        }
        return createOutput(project.links.self.href, project.attributes.name, projectType, true);
      })
    );
  } catch (err) {
    res.json(err);
  }
}

async function getFolders(hubId, projectId, oauthClient, credentials, res) {
  try {
    const projects = new ProjectsApi();
    const folders = await projects.getProjectTopFolders(hubId, projectId, oauthClient, credentials);
    res.json(
      folders.body.data.map((item) => {
        return createOutput(
          item.links.self.href,
          item.attributes.displayName == null ? item.attributes.name : item.attributes.displayName,
          item.type,
          true
        );
      })
    );
  } catch (err) {
    res.json(err);
  }
}

async function getFolderContents(projectId, folderId, oauthClient, credentials, res) {
  try {
    const folders = new FoldersApi();
    const contents = await folders.getFolderContents(
      projectId,
      folderId,
      {},
      oauthClient,
      credentials
    );
    const treeNodes = contents.body.data.map((item) => {
      var name = item.attributes.name == null ? item.attributes.displayName : item.attributes.name;
      if (name !== '') {
        // BIM 360 Items with no displayName also don't have storage, so not file to transfer
        return createOutput(item.links.self.href, name, item.type, true);
      } else {
        return null;
      }
    });
    res.json(treeNodes.filter((node) => node !== null));
  } catch (err) {
    res.json(err);
  }
}

async function getVersions(projectId, itemId, oauthClient, credentials, res) {
  try {
    const items = new ItemsApi();
    const versions = await items.getItemVersions(projectId, itemId, {}, oauthClient, credentials);
    res.json(
      versions.body.data.map((version) => {
        const dateFormated = new Date(version.attributes.lastModifiedTime).toLocaleString();
        const versionst = version.id.match(/^(.*)\?version=(\d+)$/)[2];
        const viewerUrn =
          version.relationships != null && version.relationships.derivatives != null
            ? version.relationships.derivatives.data.id
            : null;
        return createOutput(
          viewerUrn,
          decodeURI(
            'v' + versionst + ': ' + dateFormated + ' by ' + version.attributes.lastModifiedUserName
          ),
          viewerUrn != null ? 'versions' : 'unsupported',
          false
        );
      })
    );
  } catch (err) {
    res.json(err);
  }
}

function createOutput(_id, _name, _type, _children) {
  return {
    id: _id,
    name: _name,
    type: _type,
    children: _children,
  };
}
