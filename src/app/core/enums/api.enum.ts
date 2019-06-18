export enum Api {
  auth = 'json.htm?type=command&param=getauth',
  switches = 'json.htm?type=devices&filter=light&used=true',
  devices = 'json.htm?type=devices&filter={filter}&used=true',
  switchLight = 'json.htm?type=command&param=switchlight&idx={idx}&switchcmd={switchcmd}',
  refreshSwitches = 'json.htm?type=devices&filter=light&used=true&order=[Order]&lastupdate={lastupdate}&plan=0'
}
