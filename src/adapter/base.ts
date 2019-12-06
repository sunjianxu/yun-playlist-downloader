import {extname} from 'path'
import {padStart, trimStart, get} from 'lodash'
import debugFactory from 'debug'
import {getId} from '../util.js'

const debug = debugFactory('yun:adapter:base')
const NOT_IMPLEMENTED = 'not NOT_IMPLEMENTED'

export interface Song {
  ar?: [{name: string}]
  artists?: [{name: string}]
  name: string
  ajaxData: any
}

export default class BaseAdapter {
  /**
   * get title for a page
   */

  getTitle($: CheerioAPI): string {
    throw new Error(NOT_IMPLEMENTED)
  }

  /**
   * get detail
   */

  getDetail($: CheerioAPI, url: string, quality: string): any {
    throw new Error(NOT_IMPLEMENTED)
  }

  getId(url: string) {
    return getId(url)
  }

  /**
   * get songs detail
   *
   */

  getSongs(songs: Song[]) {
    // e.g 100 songs -> len = 3
    const len = String(songs.length).length

    return songs.map(function(song, index) {
      return {
        // 歌手
        singer:
          (get(song, 'ar.0.name') as string) ||
          (get(song, 'artists.0.name') as string),

        // 歌曲名
        songName: song.name,

        // url for download
        url: song.ajaxData.url as string,

        // extension
        ext: trimStart(extname(song.ajaxData.url), '.'),

        // index, first as 01
        index: padStart(String(index + 1), len, '0'),

        // rawIndex: 0,1 ...
        rawIndex: index,

        // raw
        raw: song,
      }
    })
  }
}
