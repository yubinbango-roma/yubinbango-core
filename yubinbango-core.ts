let CACHE = [];
module YubinBango {
  export class Core {
    URL = 'https://yubinbango-roma.github.io/yubinbango-data/data';
    REGION: string[] = [
      null, 'Hokkaido', 'Aomori', 'Iwate', 'Miyagi',
      'Akita', 'Yamagata', 'Fukushima', 'Ibaraki', 'Tochigi',
      'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
      'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi',
      'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie',
      'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara',
      'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima',
      'Yamaguchi', 'Tokushima', 'Kagawa', 'Ehime', 'Kochi',
      'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita',
      'Miyazaki', 'Kagoshima', 'Okinawa' 
    ];
    constructor(inputVal: string = '', callback?) {
      if(inputVal){
        // 全角の数字を半角に変換 ハイフンが入っていても数字のみの抽出
        const a:string = inputVal.replace(/[０-９]/g, (s: string) => String.fromCharCode(s.charCodeAt(0) - 65248));
        const b:RegExpMatchArray = a.match(/\d/g);
        const c:string = b.join('');
        const yubin7: string = this.chk7(c);
        // 7桁の数字の時のみ作動
        if (yubin7) {
          this.getAddr(yubin7, callback);
        } else {
          callback(this.addrDic());
        }
      }
    }
    chk7(val: string) {
      if (val.length === 7) {
        return val;
      }
    }
    addrDic(region_id = '', region = '', locality = '', street = '', extended = ''):{[key:string]: string} {
      return {
        'region_id': region_id,
        'region': region,
        'locality': locality,
        'street': street,
        'extended': extended
      };
    }
    selectAddr(addr: string[]):{[key:string]: string} {
      if (addr && addr[0] && addr[1]) {
        return this.addrDic(addr[0],this.REGION[addr[0]],addr[1],addr[2],addr[3])
      } else {
        return this.addrDic()
      }
    }
    jsonp(url: string, fn) {
      window['$yubin'] = (data) => fn(data);
      const scriptTag = document.createElement("script");
      scriptTag.setAttribute("type", "text/javascript");
      scriptTag.setAttribute("charset", "UTF-8");
      scriptTag.setAttribute("src", url);
      document.head.appendChild(scriptTag);
    }
    getAddr(yubin7: string, fn):{[key:string]: string} {
      const yubin3 = yubin7.substr(0, 3);
      // 郵便番号上位3桁でキャッシュデータを確認
      if (yubin3 in CACHE && yubin7 in CACHE[yubin3]) {
        return fn(this.selectAddr(CACHE[yubin3][yubin7]));
      } else {
        this.jsonp(`${this.URL}/${yubin3}.js`, (data) => {
          CACHE[yubin3] = data;
          return fn(this.selectAddr(data[yubin7]));
        });
      }
    }
  }
}
