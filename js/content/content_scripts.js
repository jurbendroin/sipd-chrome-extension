// console.log('run content_script.js');

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    // th.appendChild(s);
    th.insertBefore(s, th.firstChild);
}
injectScript( chrome.extension.getURL('/config.js'), 'html');


// var data = {
//     message:{
//         type: "get-actions"
//     }
// };
// chrome.runtime.sendMessage(data, function(response) {
//     console.log('Cek respon background:', response);
// });

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	var current_url = window.location.href;
	if(request.type == 'response-fecth-url'){
		var res = request.data;
		var _alert = true;
		var hide_loading = true;
		if(res.action == 'singkron_unit'){
			window.data_unit = res.renja_link;
			if(current_url.indexOf('skpd/'+config.tahun_anggaran+'/list/'+config.id_daerah+'') != -1){
				jQuery('#table_skpd tbody tr').map(function(i, b){
					var td = jQuery(b).find('td');
					var id_skpd = td.find('ul.dropdown-menu li').eq(0).find('a').attr('onclick').split("'")[1];
					id_skpd = id_skpd.split("'")[0];
					if(td.eq(1).find('a').length == 0){
						td.eq(1).append(' <a target="_blank" href="'+data_unit[id_skpd]+'?key='+config.api_key+'">Print RENJA</a>');
					}
				});
			}
		}else if(
			res.action == 'base64_encrypt'
			|| res.action == 'get_data_rka'
		){
			resolve_get_url[res.post.idrincisbl](res.data);
			_alert = false;
			hide_loading = false;
		}else if(res.action == 'get_link_laporan'){
			if(
				res.link 
				&& res.cetak == 'apbd'
				&& res.model == 'perkada'
			){
				_alert = false;
				if(res.jenis == '1'){
				    var link = ''
				        +'<a target="_blank" href="'+res.link+'?key='+config.api_key+'" class="set-lampiran apbd-penjabaran-lampiran-1 btn btn-success pull-right" style="margin-right: 10px;">(LOCAL) '+res.text_link+'</a>';
				    jQuery('#mod-hist-jadwal .modal-header .btn-circle').after(link);
				}else if(res.jenis == '2'){

				}
			}
		}
		if(hide_loading){
			jQuery('#wrap-loading').hide();
			jQuery('#persen-loading').html('');
			jQuery('#persen-loading').attr('persen', '');
			jQuery('#persen-loading').attr('total', '');
		}
		if(_alert){
			var message = res.message;
			if (res.simda_status) message += '\nStatus Singkron Simda: '+res.simda_status;
			if (res.simda_msg) message += '\nPesan Singkron Simda: '+res.simda_msg;
			swal({
				title: res.status,
				text: message,
				icon: res.status,
				//timer: 10000,
			});
		// console.log(request.data);
		}
	}else if(request.type == 'response-actions'){
		try {
			var runjob = false;
			for(var i in request.data){
				var key = request.data[i].key;
				var data = decodeURIComponent(request.data[i].data);
				data = JSON.parse(data);
	            if(!runjob && data.status == 'active'){
	            	// console.log('data.status', data.status);
	                if(key == 'get_ssh'){
	            		// console.log('key', key);
	                	var run = false;
	                	data.proses.map(function(v, k){
	                		if(!run){
	            				// console.log('run', k);
	                			for(kk in v){
	                				if(v[kk] == 0){
	                					v[kk] = 1;
	                					run = true;
	            						runjob = { 
	            							key: key,
	            							data: data,
	                						action: 'start',
	                						job: kk,
	                						proses: k
	            						};
	                				}else if(v[kk] == 1){
	                					run = true;
	                					runjob = {
	                						key: key,
	                						data: data,
	                						action: 'running',
	                						job: kk,
	                						proses: k
	                					}
	                				}
	                			}
	                		}
	                	});
	                }
	            }
			};
			console.log('runjob', runjob);
			if(runjob && runjob.action == 'start'){
				if(runjob.key == 'get_ssh'){
					if(runjob.job == 'login'){
						var home_publik = config.sipd_url+'daerah';
						var home_admin = home_publik+'/main';
						var ssh_url = home_admin+'/budget/komponen/'+config.tahun_anggaran+'/1/list/'+config.id_daerah+'/0';
						var current_url = window.location.href;

						// home publik
						if(current_url == home_publik){
							injectScript( chrome.extension.getURL('/js/content/home_to_login.js'), 'html');
						
						// home admin
						}else if(current_url.indexOf(home_admin) !== -1 && current_url.indexOf('dashboard-komponen') == -1){
							injectScript( chrome.extension.getURL('/js/content/pilih_tahun.js'), 'html');

						// dashboard admin
						}else if(current_url.indexOf('dashboard-komponen') !== -1){
							var options = {
							    message:{
							        type: "run-actions",
								    content: {
						                key: runjob.key,
						                data: runjob.data
						            }
							    }
							};
							chrome.runtime.sendMessage(options, function(response) {
							    console.log('responeMessage', response);
							});
							injectScript( chrome.extension.getURL('/js/content/halaman_ssh.js'), 'html');

						// halaman login
						}else{
							injectScript( chrome.extension.getURL('/js/content/login_ssh.js'), 'html');
						}
					}
				}
			}
		}catch(e){
			console.log(e);
		}
	}
	return sendResponse("THANKS from content_script!");
});

// injectScript( chrome.extension.getURL('/js/content/app.js'), 'html');
