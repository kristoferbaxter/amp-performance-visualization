/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { JSDOM } from 'jsdom';
import { LRUMap } from 'lru_map';
import { DocumentCache } from './document-cache';
import { getMetadata } from '../package';

const LRU_MAP_MAX_SIZE = 1000;

type DOMMap = LRUMap<string, JSDOM>;

export class DOMCache {
  private domCaches: {
    [key: string]: DOMMap;
  } = {};
  private documentCaches: {
    [key: string]: DocumentCache;
  } = {};

  /**
   *
   * @param type
   */
  public documentCache = async (type: string): Promise<DocumentCache> => {
    if (!this.documentCaches[type]) {
      this.documentCaches[type] = new DocumentCache((await getMetadata()).version, type);
      await this.documentCaches[type].enable();
    }

    return this.documentCaches[type];
  }

  /**
   *
   * @param type
   * @param url
   * @param dom
   */
  public override = async (type: string, url: string, dom: JSDOM): Promise<void> => {
    const domCache: DOMMap = this.domCache(type);
    domCache.set(url, dom);

    const documentCache: DocumentCache = await this.documentCache(type);
    const source: string = dom.serialize();
    await documentCache.set(url, source);
    await documentCache.set(url, dom.serialize());
  }

  /**
   *
   * @param type
   * @param url
   */
  public get = async (type: string, url: string): Promise<JSDOM> => {
    const domCache: DOMMap = this.domCache(type);
    if (domCache.has(url)) {
      return domCache.get(url) as JSDOM;
    }

    const documentCache: DocumentCache = await this.documentCache(type);
    const source: string = (await documentCache.get([url]))[0];
    return this.set(domCache, url, source);
  }

  //Visible for testing
  get docCache() {
    return this.documentCaches;
  }
  
  get domMapCache() {
    return this.domCaches;
  }

  /**
   * Derive the DOM Cache (or create it) for the specified type.
   * @param type key for which DOM Cache to return.
   * @returns DOM Cache for the specified type.
   */
  private domCache = (type: string): DOMMap => {
    if (this.domCaches[type]) {
      return this.domCaches[type];
    }

    return (this.domCaches[type] = new LRUMap<string, JSDOM>(LRU_MAP_MAX_SIZE));
  }

  /**
   * Store a document source as a JSDOM entry in the cache.
   * @param domCache Which DOM Cache to operate on.
   * @param url The source URL (key for Cache).
   * @param source The document source to be stored.
   * @retunrs JSDOM entry stored.
   */
  private set = (domCache: DOMMap, url: string, source: string): JSDOM => {
    const dom: JSDOM = new JSDOM(source);
    domCache.set(url, dom);
    return dom;
  }
}
