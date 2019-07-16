import { EXT, EXTLENGTH } from "./constants";

export function getTitleFromFileName(filename) {
    return filename.substr(0, filename.length - EXTLENGTH);
}

export function getExtFromFilenName(filename) {
    return filename.substr(filename.length - EXTLENGTH);
}