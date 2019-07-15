export enum Api {
  auth = 'json.htm?type=command&param=getauth',
  switches = 'json.htm?type=devices&filter=light&used=true',
  devices = 'json.htm?type=devices&filter={filter}&used=true',
  device = 'json.htm?type=devices&rid={idx}',
  renameDevice = 'json.htm?type=command&param=renamedevice&idx={idx}&name={name}',
  switchLight = 'json.htm?type=command&param=switchlight&idx={idx}&switchcmd={switchcmd}',
  refreshDevices = 'json.htm?type=devices&filter={filter}&used=true&lastupdate={lastupdate}',
  dimLevel = 'json.htm?type=command&param=switchlight&idx={idx}&switchcmd=Set%20Level&level={level}'
}
