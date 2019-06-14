import fetch from 'node-fetch';

const isAMP = async (url: string): Promise<boolean> => {
  try {
      const response = await fetch(url);
      const bodyText = await response.text();
      if (/<html\s[^>]*(⚡|amp)[^>]*>/.test(bodyText)) {
          return true
      }
      return false;
  } catch(e) {
      return false
  }
}

export default isAMP;