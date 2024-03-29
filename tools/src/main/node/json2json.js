// Copyright (c) 2022,2023 T-Systems International GmbH
// Copyright (c) 2022,2023 Bayerische Motoren Werke Aktiengesellschaft (BMW AG) 
// Copyright (c) 2022,2023 ZF Friedrichshafen AG 
// Copyright (c) 2022,2023 Mercedes-Benz AG 
// Copyright (c) 2022,2023 Contributors to the Catena-X Association
//
// See the NOTICE file(s) distributed with this work for additional
// information regarding copyright ownership.
//
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.
//
// SPDX-License-Identifier: Apache-2.0
const fs = require('fs');

var bpnl = "BPNL00000003COJN";
var input = '../../dataspace/agents/provisioning/resources/dtc_codes.json';
var inputText=fs.readFileSync(input, 'utf8');
var dtcs=JSON.parse(inputText);

var output1 = '../../dataspace/agents/provisioning/resources/dtc_codes_meta.json';
var output2 = '../../dataspace/agents/provisioning/resources/dtc_codes_content.json';
var output3 = '../../dataspace/agents/provisioning/resources/dtc_codes_part.json';

var write = function(path,obj) {
    fs.writeFileSync(path,JSON.stringify(obj),'utf8');
};

dtcs.meta.bpnl=bpnl;

write(output1,[dtcs.meta]);

var contentLength=dtcs.content.length;
var identifiers=[];
var parts=[];

write('INSERT INTO "dtc"."content" ("bpnl","number","id","code","description","possible_causes","created_at","lock_version") VALUES',true);
for(var count=0;count<contentLength;count++) {
    var dtc = dtcs.content[count];
    dtc.bpnl=bpnl;
    for(var pcount=0;pcount<dtc.parts.length;pcount++) {
        var part=dtc.parts[pcount].part;
        if(identifiers.indexOf(part.entityGuid)<0) {
            part.bpnl=bpnl;
            parts.push(part);
            identifiers.push(part.entityGuid);
        }
    }
}
write(output2,dtcs.content);
write(output3,parts);

