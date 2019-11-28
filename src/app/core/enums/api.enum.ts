export enum Api {
  auth = 'json.htm?type=command&param=getauth',
  switches = 'json.htm?type=devices&filter=light&used=true',
  devices = 'json.htm?type=devices&filter={filter}&used=true',
  device = 'json.htm?type=devices&rid={idx}',
  renameDevice = 'json.htm?type=command&param=renamedevice&idx={idx}&name={name}',
  switchLight = 'json.htm?type=command&param=switchlight&idx={idx}&switchcmd={switchcmd}',
  refreshDevices = 'json.htm?type=devices&filter={filter}&used=true&lastupdate={lastupdate}',
  dimLevel = 'json.htm?type=command&param=switchlight&idx={idx}&switchcmd=Set%20Level&level={level}',
  colorBrightness = 'json.htm?type=command&param=setcolbrightnessvalue&idx={idx}&color={color}',
  kelvinLevel = 'json.htm?type=command&param=setkelvinlevel&idx={idx}&kelvin={kelvin}',
  tempGraph = 'json.htm?type=graph&sensor=temp&idx={idx}&range={range}',
  lightLog = 'json.htm?type=lightlog&idx={idx}'
}
