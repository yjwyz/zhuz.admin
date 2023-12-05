import fse from 'fs-extra';
import ConfigShare from '../share/ConfigShare';
import { join } from 'path';

/**
 * 删除文件
 * @param filePath
 */
export function removeFile(filePath: string) {
  fse
    .remove(filePath)
    .then(() => {})
    .catch(() => {});
}

/**
 * 注册静态资源目录
 * @param resourceList
 */
export function useStaticResourceFolder() {
  try {
    const staticResourcePaths = Object.values(ConfigShare.resource);
    const wwwrootFolder = getStaticRootFolderPath();
    fse.ensureDir(wwwrootFolder);
    for (const folderPath of staticResourcePaths) {
      fse.ensureDir(wwwrootFolder + folderPath);
    }
  } catch (error) {
    console.log('静态资源目录创建失败:', error);
  }
}

/**
 * 获取静态资源根目录中的某个目录路径
 * @returns
 */
export function getStaticRootFolderPath(folderName: string = '') {
  return join(__dirname, '../../', ConfigShare.wwwroot + '/', folderName);
}

/**
 * 读取文件并存入
 * @param {String} readPath
 * @param {String} writePath
 */
export const pipeStream = (readPath: string, writePath: string) =>
  new Promise((resolve, reject) => {
    const readStream = fse.createReadStream(readPath);
    readStream.on('end', () => {
      fse.unlinkSync(readPath);
      resolve(true);
    });
    readStream.on('error', (error) => {
      reject(error);
    });
    const writeStream = fse.createWriteStream(writePath);
    writeStream.on('error', (error) => {
      reject(error);
    });
    readStream.pipe(writeStream);
  });
