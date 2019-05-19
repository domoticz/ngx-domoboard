export enum Api {
  status = 'json.htm?type=command&param=getversion',
  lights = 'json.htm?type=devices&filter=light&used=true',
  switchLight = 'json.htm?type=command&param=switchlight&idx={idx}&switchcmd={switchcmd}',
  refreshLights = 'json.htm?type=devices&filter=light&used=true&order=[Order]&lastupdate={lastupdate}&plan=0'
}
