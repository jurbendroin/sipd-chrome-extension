var __script = '';
var _s = document.getElementsByTagName('script');
for(var i=0, l=_s.length; i<l; i++){
	var _script = _s[i].innerHTML;
	if(
		_script.indexOf('remot=') != -1
		|| _script.indexOf('remot =') != -1
		|| _script.indexOf('lru1=') != -1
		|| _script.indexOf('lru1 =') != -1
	){
		__script += ' '+_script;
	}
}
eval(__script);
console.log('__script', __script);

if(typeof tokek == 'undefined'){
	tokek = jQuery('input[name="_tawon"]').val();
}

window.formData = new FormData();
if(typeof tokek != 'undefined'){
	console.log('tokek', tokek);
	formData.append('_token', tokek);
}

var tahapan = jQuery('button[onclick="setFase()"]').text().trim();
if(tahapan != ''){
	config.tahun_anggaran = tahapan.split(' - ')[1];
}

function tableHtmlToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20').replace(/#/g, '%23');
   
    filename = filename?filename+'.xls':'excel_data.xls';
   
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
   
        downloadLink.download = filename;
       
        downloadLink.click();
    }
}

function run_script(code){
	var script = document.createElement('script');
	script.appendChild(document.createTextNode(code));
	(document.head||document.documentElement).appendChild(script);
	script.parentNode.removeChild(script);
}

// http://swwwitch.com/dl/Font-Awesome-Cheetsheet-4.5.0.pdf
jQuery(document).ready(function(){
	jQuery('body').append('<style type="text/css">.swal-footer{text-align: center}<style>');
	if(config.replace_logo){
		var logo = chrome.runtime.getURL("img/logo.png");
		if(jQuery('.media-body img').length >=1){
			jQuery('.media-body img').attr('src', logo);
		}
		if(jQuery('.navbar-top-links .dropdown-toggle img').length >=1){
			jQuery('.navbar-top-links .dropdown-toggle img').attr('src', logo);
		}
		if(jQuery('.user-pro-body img').length >=1){
			jQuery('.user-pro-body img').attr('src', logo);
		}
	}

	var loading = ''
		+'<div id="wrap-loading">'
	        +'<div class="lds-hourglass"></div>'
	        +'<div id="persen-loading"></div>'
	    +'</div>';
	if(jQuery('#wrap-loading').length == 0){
		jQuery('body').prepend(loading);
	}
	window.current_url = window.location.href;
	// log('__script', __script, lru2);
	// halaman SSH
	if(
		jQuery('h3.page-title').text().indexOf('Komponen') != -1
	){
		console.log('halaman referensi SSH');
		var singkron_ssh = ''
			+'<button onClick="return false;" class="fcbtn btn btn-warning btn-outline btn-1b" id="singkron_ssh_ke_lokal">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron SSH ke DB lokal</span>'
			+'</button>'
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_ssh_dari_lokal" style="display: none;">'
				+'<i class="fa fa-cloud-upload m-r-5"></i> <span>Singkron SSH dari DB lokal</span>'
			+'</button>';
		jQuery('#table_komponen').closest('form').prepend(singkron_ssh);
		var _show_id_ssh = ''
			+'<button onclick="return false;" class="fcbtn btn btn-warning btn-outline btn-1b" id="show_id_ssh">'
				+'<i class="fa fa-eye m-r-5"></i> <span>Tampilkan ID Standar Harga</span>'
			+'</button>';
		jQuery('#table_komponen').closest('form').prepend(_show_id_ssh);
		if(document.getElementsByClassName('tambah-komponen').length){ 
	 		jQuery('#show_id_ssh').attr('style', 'margin-left: 10px;');
			var acion_all = ''
				+'<button onclick="return false;" class="fcbtn btn btn-danger btn-outline btn-1b" id="set_mulit_rek">'
					+'<span>Set Multi Kode SH dan Rek. Belanja</span>'
				+'</button>';
			jQuery('#table_komponen').closest('form').prepend(acion_all);
			var simpan_multiaddkompakun = ''
				+'<button type="button" class="btn btn-danger" name="simpan_multiaddkompakun" id="simpan_multiaddkompakun">Simpan</button>';
			jQuery('#mod-tambah-kompakun .modal-footer').prepend(simpan_multiaddkompakun);
			run_script("jQuery('#mod-tambah-kompakun').on('hidden.bs.modal', function () {"
			  	+"jQuery('#simpan_addkompakun').show();"
			  	+"jQuery('#simpan_multiaddkompakun').hide();"
			  	+"jQuery('select[name=kompakun]').val('').trigger('change');"
			+"});");
		}
		jQuery('#show_id_ssh').on('click', function(){
			jQuery('#wrap-loading').show();
			show_id_ssh();
		});
		jQuery('#set_mulit_rek').on('click', function(){
			set_mulit_rek();
		});
		jQuery('#simpan_multiaddkompakun').on('click', function(){
			jQuery('#wrap-loading').hide();
			var data_ssh = [];
			jQuery('#table_komponen tbody tr').map(function(i, b){
				if(jQuery(b).find('td input.set_lockKomponen:checked').length > 0){
					var id = jQuery(b).find('td').eq(7).find('a').attr('onclick');
					id = id.split("'")[1];
					var kode = jQuery(b).find('td').eq(1).text();
					var nama = jQuery(b).find('td').eq(2).text();
					var spek = jQuery(b).find('td').eq(3).text();
					var satuan = jQuery(b).find('td').eq(4).text();
					var harga = jQuery(b).find('td').eq(5).text();
					data_ssh.push({
						kode: kode,
						id: id,
						nama: nama,
						spek: spek,
						satuan: satuan,
						harga: harga
					});
				}
			});
			var items = [];
			data_ssh.map(function(b, i){
				items.push('"'+b.nama+' ['+b.spek+']"');
			})
			var confirm_dulu = "Apakah anda yakin menambahkan rekening ini ke item "+items.join(" | ");
			if(confirm(confirm_dulu)){
				var sendData = data_ssh.map(function(val, n){
	                return new Promise(function(resolve, reject){
	                	jQuery('input[name="idkomp"]').val(val.id);
	                	jQuery.ajax({
				          	url: lru2,
				          	type: "post",
				          	data: {
				          		"_token":tokek,
				          		"skrim":Curut(jQuery('#formtambahkompakun').serialize())
				          	},
				          	success: function(data){
								return resolve(val);
							},
							error: function(argument) {
								console.log(e);
								return resolve(val);
							}
				        });
	                })
	                .catch(function(e){
	                    console.log(e);
	                    return Promise.resolve(val);
	                });
	        	});

	            Promise.all(sendData)
	        	.then(function(val_all){
	        		alert('Berhasil set multiple Rekening Belanja pada item SSH!');
					run_script("jQuery('#mod-tambah-kompakun').modal('hide');");
					run_script('jQuery("select[name=kompakun]").val("").trigger("change");');
	        		jQuery('#wrap-loading').hide();
	            })
	            .catch(function(err){
	                console.log('err', err);
	        		alert('Ada kesalahan sistem!');
	        		jQuery('#wrap-loading').hide();
	            });
	        }
		});
		jQuery('#singkron_ssh_ke_lokal').on('click', function(){
			singkron_ssh_ke_lokal();
		});
		jQuery('#singkron_ssh_dari_lokal').on('click', function(){
			singkron_ssh_dari_lokal();
		});

		function set_mulit_rek(){
			var data_ssh = [];
			jQuery('#table_komponen tbody tr').map(function(i, b){
				if(jQuery(b).find('td input.set_lockKomponen:checked').length > 0){
					data_ssh.push(i);
				}
			});
			if(data_ssh.length == 0){
				alert('Pilih dulu item Standar Harga!');
			}else{
				jQuery('#simpan_addkompakun').hide();
				jQuery('#simpan_multiaddkompakun').show();
				run_script("jQuery('#mod-tambah-kompakun').modal('show');");
				jQuery('input[name="idkomp"]').val('');
				run_script('jQuery("select[name=kompakun]").val("").trigger("change");');
			}
		}

		function show_id_ssh(){
			jQuery('#table_komponen tbody tr').map(function(i, b){
				if(document.getElementsByClassName('tambah-komponen').length){ 
			 		var id = jQuery(b).find('td').eq(7).find('a').attr('onclick');
				 	if(id){
					 	id = id.split("'")[1];
					 	var nama = jQuery(b).find('td').eq(2);
					 	nama.html('( '+id+' ) '+nama.html());
					 }
				}else{
			 		var id = jQuery(b).find('td').eq(6).find('a').attr('onclick');
				 	if(id){
					 	id = id.split("'")[1];
					 	var nama = jQuery(b).find('td').eq(1);
					 	nama.html('( '+id+' ) '+nama.html());
					 }
				}
			});
			jQuery('#wrap-loading').hide();
		}

		function send_to_lokal(val){
			var data_ssh = { 
				action: 'singkron_ssh',
				tahun_anggaran: config.tahun_anggaran,
				api_key: config.api_key,
				ssh : {}
			};
			val.map(function(b, i){
				// if(i<5){
					data_ssh.ssh[i] = {};
					data_ssh.ssh[i].kode_kel_standar_harga	= b.kode_kel_standar_harga;
					data_ssh.ssh[i].nama_kel_standar_harga	= b.nama_kel_standar_harga;
					data_ssh.ssh[i].id_standar_harga	= b.id_standar_harga;
					data_ssh.ssh[i].kode_standar_harga	= b.kode_standar_harga;
					data_ssh.ssh[i].nama_standar_harga	= b.nama_standar_harga;
					data_ssh.ssh[i].spek	= b.spek;
					data_ssh.ssh[i].satuan	= b.satuan;
					data_ssh.ssh[i].harga	= b.harga;
					data_ssh.ssh[i].harga_2	= b.harga_2;
					data_ssh.ssh[i].harga_3	= b.harga_3;
					data_ssh.ssh[i].is_locked	= b.is_locked;
					data_ssh.ssh[i].is_deleted	= b.is_deleted;
					data_ssh.ssh[i].created_user	= b.created_user;
					data_ssh.ssh[i].created_at	= b.created_at;
					data_ssh.ssh[i].updated_user	= b.updated_user;
					data_ssh.ssh[i].updated_at	= b.updated_at;
					data_ssh.ssh[i].kelompok	= b.kelompok;
					data_ssh.ssh[i].ket_teks	= b.ket_teks;
					data_ssh.ssh[i].kd_belanja	= {};
					b.rek_belanja.map(function(d, c){
						data_ssh.ssh[i].kd_belanja[c]	= {};
						data_ssh.ssh[i].kd_belanja[c].id_akun	= d.id_akun;
						data_ssh.ssh[i].kd_belanja[c].kode_akun	= d.kode_akun;
						data_ssh.ssh[i].kd_belanja[c].nama_akun	= d.nama_akun;
					});
				// }
			});
			var data = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_ssh,
					    return: false
					}
			    }
			};
			chrome.runtime.sendMessage(data, function(response) {
			    console.log('responeMessage', response);
			});
		}

		function singkron_ssh_ke_lokal(){
			if(confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
				jQuery('#wrap-loading').show();
				jQuery('#persen-loading').attr('persen', 0);
				jQuery('#persen-loading').html('0%');
				(function runAjax(retries, delay){
					delay = delay || 30000;
					jQuery.ajax({
						url: lru1,
						timeout: 30000,
						type: 'POST',
						data: formData,
						processData: false,
						contentType: false,
						success: function(data){
							var data_all = [];
							var data_sementara = [];
							console.log(data.data.length);
							data.data.map(function(b, i){
								//console.log(i);
								data_sementara.push(b);
								var n = i+1;
								if(n%50 == 0 || n == data.data.length){
									console.log(n);
									data_all.push(data_sementara);
									data_sementara = [];
								}
							});

							var i = 0;
							var last = data_all.length-1;
							data_all.reduce(function(sequence, nextData){
								return sequence.then(function(current_data){
									return new Promise(function(resolve_redurce, reject_redurce){
										var sendData = current_data.map(function(val, n){
											var kode = val.action.split("tampilAkun('")[1].split("'")[0];
											return new Promise(function(resolve, reject){
												jQuery.ajax({
													url: endog + '?' + kode,
													type: 'POST',
													data: formData,
													processData: false,
													contentType: false,
													success: function(ret){
														val.rek_belanja = ret.data;
														return resolve(val);
													},
													error: function(e) {
														console.log(e);
														return resolve(val);
													}
												});
											});
										});

										Promise.all(sendData)
										.then(function(val_all){
											// i++;
											// if(i==1){
												send_to_lokal(val_all);
											// }
											var c_persen = +jQuery('#persen-loading').attr('persen');
											c_persen++;
											jQuery('#persen-loading').attr('persen', c_persen);
											jQuery('#persen-loading').html(((c_persen/data_all.length)*100).toFixed(2)+'%');
											return resolve_redurce(nextData);
										})
										.catch(function(err){
											console.log('err', err);
											return resolve_redurce(nextData);
										});
									})
									.catch(function(e){
										console.log(e);
										return Promise.resolve(nextData);
									});
								})
								.catch(function(e){
									console.log(e);
									return Promise.resolve(nextData);
								});
							}, Promise.resolve(data_all[last]))
							.then(function(data_last){
								// console.log(data_last);
								jQuery('#wrap-loading').hide();
								jQuery('#persen-loading').html('');
								jQuery('#persen-loading').attr('persen', '');
								jQuery('#persen-loading').attr('total', '');
								sweetAlert('Data berhasil disimpan di database lokal!');
							})
							.catch(function(e){
								console.log(e);
							});
						}
					})
					.fail(function(){
						console.log('Koneksi error. Coba lagi'+retries); // prrint retry count
						retries > 0 && setTimeout(function(){
							runAjax(--retries,30000);
						},delay);
					})
			  	})(20, 30000);
			}
		}
	}else if(current_url.indexOf('main/'+get_type_jadwal()+'/akun/'+config.tahun_anggaran) != -1){
		console.log('halaman akun belanja');
		var singkron_akun_belanja = ''
			+'<button class="fcbtn btn btn-warning btn-outline btn-1b" id="singkron_akun_ke_lokal">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron Akun Belanja ke DB lokal</span>'
			+'</button>';
		jQuery('#table_akun').closest('.white-box').find('.pull-right').prepend(singkron_akun_belanja);


		jQuery('#singkron_akun_ke_lokal').on('click', function(){
			singkron_akun_ke_lokal();
		});

		function singkron_akun_ke_lokal(){
			if(confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
				jQuery('#wrap-loading').show();
				(function runAjax(retries, delay){
					delay = delay || 30000;
					jQuery.ajax({
						url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/akun/'+config.tahun_anggaran+'/tampil-akun/'+config.id_daerah+'/0',
						timeout: 30000,
						contentType: 'application/json',
						success: function(data){
							var data_akun = { 
								action: 'singkron_akun_belanja',
								tahun_anggaran: config.tahun_anggaran,
								api_key: config.api_key,
								akun : {}
							};
							data.data.map(function(akun, i){
								// if(i<5){
									data_akun.akun[i] = {};
									data_akun.akun[i].belanja = akun.belanja;
									data_akun.akun[i].id_akun = akun.id_akun;
									data_akun.akun[i].is_bagi_hasil = akun.is_bagi_hasil;
									data_akun.akun[i].is_bankeu_khusus = akun.is_bankeu_khusus;
									data_akun.akun[i].is_bankeu_umum = akun.is_bankeu_umum;
									data_akun.akun[i].is_barjas = akun.is_barjas;
									data_akun.akun[i].is_bl = akun.is_bl;
									data_akun.akun[i].is_bos = akun.is_bos;
									data_akun.akun[i].is_btt = akun.is_btt;
									data_akun.akun[i].is_bunga = akun.is_bunga;
									data_akun.akun[i].is_gaji_asn = akun.is_gaji_asn;
									data_akun.akun[i].is_hibah_brg = akun.is_hibah_brg;
									data_akun.akun[i].is_hibah_uang = akun.is_hibah_uang;
									data_akun.akun[i].is_locked = akun.is_locked;
									data_akun.akun[i].is_modal_tanah = akun.is_modal_tanah;
									data_akun.akun[i].is_pembiayaan = akun.is_pembiayaan;
									data_akun.akun[i].is_pendapatan = akun.is_pendapatan;
									data_akun.akun[i].is_sosial_brg = akun.is_sosial_brg;
									data_akun.akun[i].is_sosial_uang = akun.is_sosial_uang;
									data_akun.akun[i].is_subsidi = akun.is_subsidi;
									data_akun.akun[i].kode_akun = akun.kode_akun;
									data_akun.akun[i].nama_akun = akun.nama_akun;
									data_akun.akun[i].set_input = akun.set_input;
									data_akun.akun[i].set_lokus = akun.set_lokus;
									data_akun.akun[i].status = akun.status;
								// }
							});
							var data = {
								message:{
									type: "get-url",
									content: {
										url: config.url_server_lokal,
										type: 'post',
										data: data_akun,
										return: true
									}
								}
							};
							chrome.runtime.sendMessage(data, function(response) {
								console.log('responeMessage', response);
							});
						}
					})
					.fail(function(){
						console.log('Koneksi error. Coba lagi'+retries); // prrint retry count
						retries > 0 && setTimeout(function(){
						  runAjax(--retries);
					  },delay);
					})
				})(20);
			}
		}
	}else if(
		(
			jQuery('.cetak').closest('body').attr('onload') == 'window.print()'
			&& current_url.indexOf('/siap/') == -1
			&& current_url.indexOf('/apbd/') == -1
		)
		|| current_url.indexOf('rka-bl-rinci/cetak') != -1
		|| current_url.indexOf('lampiran/'+config.tahun_anggaran+'/kua/41/'+config.id_daerah+'/setunit') != -1
		|| current_url.indexOf('lampiran/'+config.tahun_anggaran+'/kua/42/'+config.id_daerah+'/setunit') != -1
		|| current_url.indexOf('dokumen/'+config.tahun_anggaran+'/rka-penda/cetak/'+config.id_daerah+'/') != -1
		|| current_url.indexOf('belanja/'+config.tahun_anggaran+'/rinci/cetak/'+config.id_daerah+'/') != -1
		|| current_url.indexOf('dokumen/'+config.tahun_anggaran+'/rka-biaya/cetak/'+config.id_daerah+'/') != -1
	){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'html');
		if(current_url.indexOf('dokumen/'+config.tahun_anggaran+'/rka-penda/cetak/'+config.id_daerah+'/') == -1){
			if(config.tgl_rka){
				var tgl = get_tanggal();
				var tgl_rka = jQuery(jQuery('td.text_tengah[colspan="3"]')[0]);
				tgl_rka.text(tgl_rka.text().replace(/\./g, '')+' '+tgl);
			}
		}
		if(config.tapd){
			config.tapd.map(function(b, i){
				var tbody_tapd = jQuery('table[cellpadding="5"][cellspacing="0"] tr.text_tengah').parent();
				var tr_tapd = tbody_tapd.find('tr');
				tr_tapd.find('td').eq(2).css('min-width', '200px');
				if(jQuery(tr_tapd[i+2]).length == 0){
					var tr_html = ''
						+'<tr>'
	                        +'<td width="10" class="kiri kanan bawah" style=" border-bottom:1px solid #000; border-left:1px solid #000; border-right:1px solid #000; mso-number-format:\@;">'+(i+1)+'.</td>'
	                        +'<td class="bawah kanan" style=" border-bottom:1px solid #000; border-right:1px solid #000; mso-number-format:\@;">'+b.nama+'</td>'
	                        +'<td class="bawah kanan" style="min-width: 200px; border-bottom:1px solid #000; border-right:1px solid #000; mso-number-format:\@;">'+b.nip+'</td>'
	                        +'<td class="bawah kanan" style=" border-bottom:1px solid #000; border-right:1px solid #000; mso-number-format:\@;">'+b.jabatan+'</td>'
	                        +'<td class="bawah kanan" style=" border-bottom:1px solid #000; border-right:1px solid #000; mso-number-format:\@;">&nbsp;</td>'
	                    +'</tr>';
					tbody_tapd.append(tr_html);
				}else{
					var td = jQuery(tr_tapd[i+2]).find('td');
					td.eq(1).text(b.nama);
					td.eq(2).text(b.nip);
					td.eq(3).text(b.jabatan);
				}
			});
		}

		run_download_excel();
		if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/kua/41/'+config.id_daerah+'/setunit') != -1){
			jQuery('table[cellpadding="5"] tr').map(function(i,b){
			    var kode = jQuery(b).find('td').eq(0).text().split('.');
			    if(kode.length == 5){
			        jQuery(b).addClass('kegiatan');
			    }else if(kode.length == 6){
			        jQuery(b).addClass('sub_kegiatan');
			    }
			});
			var opsiprint = ''
				+'<label><input type="radio" id="hide_kegiatan"> Sembunyikan Kegiatan dan Sub kegiatan</label><br>'
			jQuery('#action-sipd').append(opsiprint);
			jQuery('#hide_kegiatan').on('click', function(){
				if(jQuery(this).prop('checked')){
					jQuery('.kegiatan').remove();
					jQuery('.sub_kegiatan').remove();
				}
			});
		}else if(
			current_url.indexOf('belanja/'+config.tahun_anggaran+'/rinci/cetak/'+config.id_daerah+'/') != -1
			|| current_url.indexOf('rka-bl-rinci/cetak') != -1
		){
			logo_rka();
			
			var opsiprint = ''
				+'<label><input type="radio" id="tampil_alamat"> Tampilkan Alamat Rincian</label><br>'
			jQuery('#action-sipd').append(opsiprint);
			jQuery('#tampil_alamat').on('click', function(){
				if(current_url.indexOf('rka-bl-rinci/cetak') != -1){
					jQuery('#wrap-loading').show();
					var subkeg = {};
					var kode_sub = '';
					jQuery('table[cellpadding="5"]').eq(4).find('>tbody>tr').map(function(i, b){
						var td = jQuery(b).find('>td');
						if(td.length == 1){
							kode_sub = td.find('table>tbody>tr').eq(0).find('td').eq(2).html().split('&nbsp;')[0];
							subkeg[kode_sub] = {};
						}else{
							subkeg[kode_sub][i] = 'tr_id';
						}

					});
					var sendData = [];
					for(var i in subkeg){
						sendData.push(new Promise(function(resolve_reduce, reject_reduce){
							tampil_alamat_rka(i, subkeg[i], function(){
								resolve_reduce();
							});
						}))
					}
					Promise.all(sendData)
					.then(function(val){
						jQuery('#wrap-loading').hide();
					});
				}else{
					tampil_alamat_rka();
				}
			});
		}
	}else if(
		jQuery('h3.page-title').text() == 'Kegiatan / Sub Kegiatan Belanja'
	){
		console.log('halaman sub kegiatan');
		var tahap = window.location.href.split('/')[5];
		var singkron_rka = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_rka_ke_lokal">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron RKA ke DB lokal</span>'
			+'</button>';
		// halaman list SKPD oleh admin TAPD
		if(jQuery('.icon-basket').closest('.m-t-0').length == 0){
			jQuery('.m-l-10').closest('.p-b-20').find('.col-md-2').append('<div class="button-box pull-right p-t-20">'+singkron_rka+'</div>');
			jQuery('#singkron_rka_ke_lokal').attr('id_unit', 'all');
		// halaman list sub kegiatan oleh kepala PD
		}else if(jQuery('#form_bl .pull-right.p-t-20').length >= 1){
			jQuery('#form_bl .pull-right.p-t-20').append(singkron_rka);
		// halaman sub kegiatan oleh user operator
		}else{
			jQuery('.icon-basket').closest('.m-t-0').append('<div class="col-xs-12 col-md-6"><div class="button-box pull-right p-t-20">'+singkron_rka+'</div></div>');
		}
		jQuery('#tampil_laporan_renja').on('click', function(){
			singkron_skpd_ke_lokal(1);
		});
		jQuery('#singkron_rka_ke_lokal').on('click', function(){
			var cek_unit = jQuery('#singkron_rka_ke_lokal').attr('id_unit');
			if(cek_unit == 'all'){
				if(confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
					jQuery('#wrap-loading').show();
					(function runAjax(retries, delay){
						delay = delay || 30000;
						jQuery.ajax({
							url: tamu,
							type: 'post',
							data: formData,
							processData: false,
							contentType: false,
							timeout: 30000,
							success: function(units){
								jQuery('#persen-loading').attr('progress', 0);
								jQuery('#persen-loading').html('0.00%');
								jQuery('#persen-loading').attr('total', 0);
								var last = units.data.length-1;
								units.data.reduce(function(sequence, nextData){
									return sequence.then(function(current_data){
										return new Promise(function(resolve_reduce, reject_reduce){
											jQuery.ajax({
												url: endog + '?' + current_data.nama_skpd.sParam,
												success: function(html){
													var kode_get = html.split('lru8="')[1].split('"')[0];
													current_data.kode_get = kode_get;
													singkron_rka_ke_lokal_all(current_data, function(){
														// //console.log('Melanjutkan ke Unit berikutnya:', nextData.id_unit);
														// resolve_reduce(nextData);
													});
													resolve_reduce(nextData);
												}
											});
										})
										.catch(function(e){
											console.log(e);
											return Promise.resolve(nextData);
										});
									}, Promise.resolve(units.data[last]))
									.then(function(data_last){
										var opsi = { 
											action: 'get_cat_url',
											api_key: config.api_key,
											category : 'Semua Perangkat Daerah Tahun Anggaran '+config.tahun_anggaran
										};
										var data = {
											message:{
												type: "get-url",
												content: {
													url: config.url_server_lokal,
													type: 'post',
													data: opsi,
													return: false
												}
											}
										};
										chrome.runtime.sendMessage(data, function(response) {
											console.log('responeMessage', response);
										});
									})
									.catch(function(e){
										console.log(e);
									});
								});
							}
						})
						.fail(function(){
							console.log('Koneksi error. Coba lagi'+retries); // prrint retry count
							retries > 0 && setTimeout(function(){
								runAjax(--retries,30000);
							},delay);
						})
					})(20, 30000);
				}
			}else{
				singkron_rka_ke_lokal_all();
			}
		});
	}else if(current_url.indexOf('skpd/'+config.tahun_anggaran+'/list/'+config.id_daerah+'') != -1){
		var singkron_skpd = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_skpd_ke_lokal">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron SKPD ke DB lokal</span>'
			+'</button>'
			+'<button class="fcbtn btn btn-success btn-outline btn-1b" id="tampil_laporan_renja" style="margin-left: 20px;">'
				+'<i class="fa fa-print m-r-5"></i> <span>Tampilkan Link Print RENJA</span>'
			+'</button>';
		jQuery('.button-box.pull-right.p-t-0').parent().prepend(singkron_skpd);
		jQuery('#singkron_skpd_ke_lokal').on('click', function(){
			singkron_skpd_ke_lokal();
		});
		jQuery('#tampil_laporan_renja').on('click', function(){
			singkron_skpd_ke_lokal(1);
		});
	}else if(
		jQuery('h3.page-title').text() == 'Rincian Belanja Sub Kegiatan'
	){
		console.log('halaman rincian sub kegiatan');

		// harus di inject agar bekerja
		run_script('window.ext_url = "'+chrome.extension.getURL('')+'"');
		injectScript( chrome.extension.getURL('/js/content/rka.js'), 'html');

		var singkron_rka = ''
			+'<button class="fcbtn btn btn-info btn-outline btn-1b" id="download_data_excel" style="display: none;">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Download Rincian Excel</span>'
			+'</button>'
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_rka_ke_lokal">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron RKA ke DB lokal</span>'
			+'</button>';
		jQuery('.button-box').prepend(singkron_rka);
		jQuery('#download_data_excel').on('click', function(){
			tableHtmlToExcel('data_rin_excel', jQuery('table.m-b-0>tbody>tr').eq(4).find('td').eq(2).text().trim());
		});
		jQuery('#singkron_rka_ke_lokal').on('click', function(){
			jQuery('#download_data_excel').hide();
			jQuery('body').prepend(''
				+'<table id="data_rin_excel" style="display:none; margin-top: 60px; background: #fff;" class="table table-bordered">'
					+'<thead>'
						+'<tr>'
							+'<th>No</th>'
							+'<th>kode_sbl</th>'
							+'<th>jenis_bl</th>'
							+'<th>idsubtitle</th>'
							+'<th>subs_bl_teks</th>'
							+'<th>idketerangan</th>'
							+'<th>ket_bl_teks</th>'
							+'<th>kode_akun</th>'
							+'<th>nama_akun</th>'
							+'<th>nama_komponen</th>'
							+'<th>spek_komponen</th>'
							+'<th>koefisien</th>'
							+'<th>satuan</th>'
							+'<th>harga_satuan</th>'
							+'<th>totalpajak</th>'
							+'<th>rincian</th>'
							+'<th>id_rinci_sub_bl</th>'
							+'<th>id_penerima</th>'
							+'<th>lokus_akun_teks</th>'
							+'<th>id_prop_penerima</th>'
							+'<th>id_camat_penerima</th>'
							+'<th>id_kokab_penerima</th>'
							+'<th>id_lurah_penerima</th>'
							+'<th>idkomponen</th>'
						+'</tr>'
					+'</thead>'
				+'</table>');
			singkron_rka_ke_lokal();
		});

		if(jQuery('button.tambah-detil').length >= 1){
			var master_html = ''
            	+'<button onclick="return false;" class="btn btn-primary" id="singkron_master_cse" style="float:right; margin-left: 10px;">Singkron Data Master ke DB Lokal</button>'
            	+'<select class="form-control" style="width: 300px; float: right;" id="data_master_cse">'
            		+'<option value="">Pilih Data Master</option>'
            		+'<option value="penerima_bantuan">Master Data Penerima Bantuan</option>'
            		+'<option value="alamat">Master Data Provinsi, Kabupaten/Kota, Kecamatan, Desa/Kelurahan</option>'
            	+'</select>';
			jQuery('.bg-title .col-lg-6').eq(1).prepend(master_html);
			jQuery('#singkron_master_cse').on('click', function(){
				var val = jQuery('#data_master_cse').val();
				if(val == ''){
					alert('Data Master tidak boleh kosong!');
				}else{
					singkron_master_cse(val);
				}
			});
		}
	// SIKRONISASI PROGRAM PRIORITAS NASIONAL DENGAN PROGRAM PRIORITAS DAERAH (APBD perda)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/9/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	// SINKRONISASI PROGRAM, KEGIATAN DAN SUB KEGIATAN PADA RKPD DAN PPAS (APBD perda)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/8/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	// SINKRONISASI PROGRAM PADA RPJMD DENGAN APBD (APBD perda)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/7/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	// REKAPITULASI BELANJA UNTUK PEMENUHAN SPM (APBD perda)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/6/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	// URUSAN PEMERINTAHAN DAERAH DAN FUNGSI DALAM KERANGKA PENGELOLAAN KEUANGAN NEGARA (APBD perda) 5
	// ALOKASI BANTUAN KEUANGAN BERSIFAT UMUM dan KHUSUS YANG DITERIMA SERTA SKPD PEMBERI BANTUAN KEUANGAN (APBD penjabaran) 5
	// REKAPITULASI BELANJA MENURUT URUSAN PEMERINTAHAN DAERAH, ORGANISASI, PROGRAM DAN KEGIATAN BESERTA HASIL DAN SUB KEGIATAN BESERTA KELUARAN (APBD perda) 4
	// ALOKASI BANTUAN SOSIAL BERUPA UANG YANG DITERIMA SERTA SKPD PEMBERI BANTUAN SOSIAL & ALOKASI HIBAH BERUPA BARANG/JASA YANG DITERIMA SERTA SKPD PEMBERI HIBAH (APBD penjabaran) 4
	// RINCIAN APBD MENURUT URUSAN PEMERINTAHAN DAERAH, ORGANISASI, PENDAPATAN, BELANJA DAN PEMBIAYAAN (APBD perda) 3
	// DAFTAR ALOKASI HIBAH BERUPA UANG YANG DITERIMA SERTA SKPD PEMBERI HIBAH (APBD penjabaran) 3
	}else if(
		current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/4/'+config.id_daerah+'/setunit') != -1
		|| current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/3/'+config.id_daerah+'/setunit') != -1
		|| current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/5/'+config.id_daerah+'/setunit') != -1
	){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		jQuery('#wrap-loading').show();
		jQuery('table[cellpadding="3"]').map(function(i, b){
			jQuery(b).before('<table id="header-title'+i+'" width="100%"><tbody></tbody></table>');
			jQuery(b).find('tr>td>div').closest('tr').prependTo("#header-title"+i+">tbody");
		});
		jQuery('table[align="right"]').map(function(i, b){
			jQuery(b).insertBefore("#header-title"+i);
		});
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));

		var table = [];
		jQuery('table[cellpadding="3"]').map(function(i, b){
			table.push(b);
		});

		var tahapan = 'murni';
		var n_tahapan = 0;
		var l_check = jQuery('table[cellpadding="3"]').eq(0).find('tr').eq(2).find('td').length;
		if(l_check == 6){
			tahapan = 'pergeseran';
			n_tahapan = 2;
		}

		var nomor_lampiran = getNomorLampiran();
		var last = table.length-1;
		table.reduce(function(sequence, nextData){
			// fungsi ini didisable karena format lampiran sudah tidak didukung lagi. dilanjutkan dengan pengembangan di sipd lokal
			return Promise.resolve(nextData);

            return sequence.then(function(current_data){
        		return new Promise(function(resolve_reduce, reject_reduce){
        			var dinas = {
						kode: '',
						nama: '',
						data: {}
					};
					var subkeg = {
						kode: '',
						nama: '',
						data: {}
					}
        			var tr = [];
        			jQuery(current_data).find('>tbody>tr').map(function(n, m){
        				tr.push(m);
        			});
        			var lasttr = tr.length-1;
        			tr.reduce(function(sequence2, nextData2){
			            return sequence2.then(function(current_data2){
			        		return new Promise(function(resolve_reduce2, reject_reduce2){
        						var td = jQuery(current_data2).find('td');
        						console.log('tr', current_data2, td.length, n_tahapan);
								if(td.length == 2){
									var text = td.eq(1).text().split(' ');
									var kode = text.shift();
									var nama = text.join(' ');
									if(kode.split('.').length == 8){
										dinas.kode = kode;
										dinas.nama = nama;
										console.log('dinas', dinas);
										getAllUnit().then(function(unit){
											unit.map(function(un, m){
												if(un.kode_skpd == dinas.kode){
													dinas.data = un;
												}
											});
			        						resolve_reduce2(nextData2);
										})
							            .catch(function(e){
							                console.log(e);
							                resolve_reduce2(nextData2);
							            });
									}else{
										subkeg.kode = kode;
										subkeg.nama = nama;
										subkeg.sub_skpd = [];
										getAllUnit().then(function(unit){
											unit.map(function(un, m){
												if(un.id_unit == dinas.data.id_unit){
													subkeg.sub_skpd.push(un);
												}
											});
											console.log('subkeg.sub_skpd', subkeg.sub_skpd);
											var lastsubskpd = subkeg.sub_skpd.length-1;
											subkeg.sub_skpd.reduce(function(sequence3, nextData3){
									            return sequence3.then(function(current_data3){
									        		return new Promise(function(resolve_reduce3, reject_reduce3){
									        			// console.log('current_data3.id_skpd', current_data3, current_data3.id_skpd);
														getAllSubKeg(current_data3.id_skpd).then(function(all_sub){
															all_sub.map(function(sub, m){
																if(sub.kode_sub_giat == subkeg.kode){
																	subkeg.data = sub;
																	dinas.data = current_data3;
																}
															});
							        						resolve_reduce3(nextData3);
														})
											            .catch(function(e){
											                console.log(e);
											                resolve_reduce3(nextData3);
											            });
									        		})
									                .catch(function(e){
									                    console.log(e);
									                    return Promise.resolve(nextData3);
									                });
									            })
									            .catch(function(e){
									                console.log(e);
									                return Promise.resolve(nextData3);
									            });
									        }, Promise.resolve(subkeg.sub_skpd[lastsubskpd]))
									        .then(function(){
						        				resolve_reduce2(nextData2);
									        })
								            .catch(function(e){
								                console.log(e);
								                resolve_reduce2(nextData2);
								            });
										})
							            .catch(function(e){
							                console.log(e);
							                resolve_reduce2(nextData2);
							            });
									}
								}else if(td.length == (4+n_tahapan)){
									var kelompok = {
										nama: td.eq(1).text().trim(),
										data: []
									};
									getRincSubKeg(dinas.data.id_skpd, subkeg.data.kode_sbl).then(function(all_rinc){
										var penerima = [];
										var nomor = 0;
										var _style = {
											td_1: 'class="'+td.eq(0).attr('class')+'" width="'+td.eq(0).attr('width')+'" style="'+td.eq(0).attr('style')+'"',
											td_2: 'class="'+td.eq(1).attr('class')+'" width="'+td.eq(1).attr('width')+'" style="'+td.eq(1).attr('style')+'"',
											td_3: 'class="'+td.eq(2).attr('class')+'" width="'+td.eq(2).attr('width')+'" style="'+td.eq(2).attr('style')+'"',
											td_4: 'class="'+td.eq(3).attr('class')+'" width="'+td.eq(3).attr('width')+'" style="'+td.eq(3).attr('style')+'"'
										}

										var jenis_bl = '';
										var jenis_akun = '';
										if(nomor_lampiran == 3){
											jenis_bl = 'HIBAH,BOS';
											jenis_akun = 'is_hibah_uang';
										}else if(nomor_lampiran == 4){
											jenis_bl = 'BANSOS';
											jenis_akun = 'is_sosial_uang';
										}else if(nomor_lampiran == 5){
											jenis_bl = 'BANKEU';
											jenis_akun = 'is_bankeu_khusus,is_bankeu_umum';
										}
										getMultiAkunByJenisBl(jenis_bl, dinas.data.id_skpd, subkeg.data.kode_sbl, jenis_akun).then(function(akun){
											if(!kelompok.nama){
												var total_bansos = 0;
												all_rinc.map(function(rin, m){
													if(
														(
															(rin.jenis_bl == 'bansos' && nomor_lampiran == 4)
															|| (rin.jenis_bl == 'hibah' && nomor_lampiran == 3)
														)
														&& akun[rin.kode_akun]
													){
														kelompok.data.push(rin);
														nomor++;
														rin.nomor = nomor;
														penerima.push(rin);
														total_bansos += +rin.rincian;
													}
												});
												console.log('total bansos/hibah uang', dinas.nama, subkeg.nama, total_bansos);
											}else{
												all_rinc.map(function(rin, m){
													if(
														rin.subs_bl_teks == kelompok.nama
														&& akun[rin.kode_akun]
													){
														kelompok.data.push(rin);
														nomor++;
														rin.nomor = nomor;
														penerima.push(rin);
													}
												});
											}
											// console.log('kelompok, nomor_lampiran, penerima', kelompok, nomor_lampiran, penerima);

											var penerimaHTML = [];
											var lastpenerima = penerima.length-1;
											penerima.reduce(function(sequence3, nextData3){
									            return sequence3.then(function(current_data3){
									        		return new Promise(function(resolve_reduce3, reject_reduce3){
														getDetailPenerima(subkeg.data.kode_sbl, false, nomor_lampiran).then(function(all_penerima){
															var kode_get_rka = '';
															if(current_data3.action != ''){
							                					var kode_get_rka = current_data3.action.split("ubahKomponen('")[1].split("'")[0];
															}
							                				console.log('kode_get_rka', kode_get_rka, current_data3);
															getDetailRin(dinas.data.id_skpd, subkeg.data.kode_sbl, current_data3.id_rinci_sub_bl, nomor_lampiran, kode_get_rka)
															.then(function(rinci_penerima){
																if(
																	rinci_penerima == ''
																	|| !rinci_penerima
																){
																	return resolve_reduce3(nextData3);
																}
																var alamat = '';
																if(nomor_lampiran == 5){
																	alamat = 'Provinsi '+rinci_penerima.nama_prop
																		+', '+rinci_penerima.nama_kab
																		+', Kecamatan '+rinci_penerima.nama_kec
																		+', '+rinci_penerima.nama_kel;
																}else{
																	all_penerima.map(function(p, o){
																		if(p.id_profil == rinci_penerima.id_penerima){
																			alamat = p.alamat_teks+' - '+p.jenis_penerima;
																		}
																	});
																}
																var html_rinci = '<td '+_style.td_4+'>'+formatRupiah(current_data3.rincian)+'</td>';
																if(tahapan == 'pergeseran'){
																	html_rinci = ''
																		+'<td '+_style.td_4+'>'+formatRupiah(current_data3.rincian_murni)+'</td>'
																		+'<td '+_style.td_4+'>'+formatRupiah(current_data3.rincian)+'</td>'
																		+'<td '+_style.td_4+'>'+formatRupiah(current_data3.rincian_murni-current_data3.rincian)+'</td>';
																}
																penerimaHTML[current_data3.nomor] = ''
																	+'<tr class="tambahan">'
																		+'<td '+_style.td_1+'>'+current_data3.nomor+'</td>'
																		+'<td '+_style.td_2+'>'+current_data3.lokus_akun_teks+'</td>'
																		+'<td '+_style.td_3+'>'+alamat+' ('+current_data3.koefisien+' x '+formatRupiah(current_data3.harga_satuan)+')</td>'
																		+html_rinci
																	+'</tr>';
										                    	return resolve_reduce3(nextData3);
															});
														});
									        		})
									                .catch(function(e){
									                    console.log(e);
									                    return Promise.resolve(nextData3);
									                });
									            })
									            .catch(function(e){
									                console.log(e);
									                return Promise.resolve(nextData3);
									            });
									        }, Promise.resolve(penerima[lastpenerima]))
									        .then(function(){
												console.log('dinas, subkeg, kelompok', dinas, subkeg, kelompok);
												jQuery(current_data2).after(penerimaHTML.join(''));
						        				resolve_reduce2(nextData2);
									        })
								            .catch(function(e){
								                console.log(e);
								                resolve_reduce2(nextData2);
								            });
									    })
							            .catch(function(e){
							                console.log(e);
							                resolve_reduce2(nextData2);
							            });
									});
								}else if(td.length == (5+n_tahapan)){
									var kelompok = {
										nama: td.eq(1).text().trim(),
										bentuk: td.eq(3).text().trim(),
										total: td.eq(4).text().trim().replace(/\./g, ''),
										data: []
									};
									if(isNaN(kelompok.total) || +kelompok.total == 0){
							            resolve_reduce2(nextData2);
									};
									if(kelompok.bentuk.indexOf('[?]') != -1){
										kelompok.bentuk = '[?]';
									};
									getRincSubKeg(dinas.data.id_unit, subkeg.data.kode_sbl).then(function(all_rinc){
										var penerima = [];
										var nomor = 0;
										var _style = {
											td_1: 'class="'+td.eq(0).attr('class')+'" width="'+td.eq(0).attr('width')+'" style="'+td.eq(0).attr('style')+'"',
											td_2: 'class="'+td.eq(1).attr('class')+'" width="'+td.eq(1).attr('width')+'" style="'+td.eq(1).attr('style')+'"',
											td_3: 'class="'+td.eq(2).attr('class')+'" width="'+td.eq(2).attr('width')+'" style="'+td.eq(2).attr('style')+'"',
											td_4: 'class="'+td.eq(3).attr('class')+'" width="'+td.eq(3).attr('width')+'" style="'+td.eq(3).attr('style')+'"',
											td_5: 'class="'+td.eq(4).attr('class')+'" width="'+td.eq(4).attr('width')+'" style="'+td.eq(4).attr('style')+'"'
										}

										var jenis_bl = '';
										var jenis_akun = '';
										if(nomor_lampiran == 3){
											jenis_bl = 'HIBAH-BRG';
											jenis_akun = 'is_hibah_brg';
										}else if(nomor_lampiran == 4){
											jenis_bl = 'BANSOS-BRG';
											jenis_akun = 'is_sosial_brg';
										}
										getMultiAkunByJenisBl(jenis_bl, dinas.data.id_unit, subkeg.data.kode_sbl, jenis_akun).then(function(akun){
											if(!kelompok.nama){
												var total_bansos = 0;
												all_rinc.map(function(rin, m){
													if(
														(
															(rin.jenis_bl == jenis_bl.toLowerCase() && nomor_lampiran == 4)
															|| (rin.jenis_bl == jenis_bl.toLowerCase() && nomor_lampiran == 3)
														)
														&& kelompok.bentuk == (rin.nama_standar_harga.nama_komponen+rin.nama_standar_harga.spek_komponen).trim()
														&& akun[rin.kode_akun]
														&& rin.subs_bl_teks == '[#]'
													){
														kelompok.data.push(rin);
														nomor++;
														rin.nomor = nomor;
														penerima.push(rin);
														total_bansos += +rin.rincian;
													}
												});
												console.log('total bansos/hibah barang', dinas.nama, subkeg.nama, total_bansos);
											}else{
												all_rinc.map(function(rin, m){
													if(
														rin.subs_bl_teks == kelompok.nama
														&& kelompok.bentuk == (rin.nama_standar_harga.nama_komponen+rin.nama_standar_harga.spek_komponen).trim()
														&& akun[rin.kode_akun]
													){
														kelompok.data.push(rin);
														nomor++;
														rin.nomor = nomor;
														penerima.push(rin);
													}
												});
												if(kelompok.data.length == 0){
													console.log('Kelompok tidak ditemukan! dinas, subkeg, kelompok', dinas, subkeg, kelompok, all_rinc, akun);
												}
											}
											var penerimaHTML = [];
											var lastpenerima = penerima.length-1;
											penerima.reduce(function(sequence3, nextData3){
									            return sequence3.then(function(current_data3){
									        		return new Promise(function(resolve_reduce3, reject_reduce3){
														getDetailPenerima(subkeg.data.kode_sbl).then(function(all_penerima){
															var kode_get_rka = '';
															if(current_data3.action != ''){
							                					var kode_get_rka = current_data3.action.split("ubahKomponen('")[1].split("'")[0];
															}
							                				console.log('kode_get_rka', kode_get_rka, current_data3);
															getDetailRin(dinas.data.id_unit, subkeg.data.kode_sbl, current_data3.id_rinci_sub_bl, false, kode_get_rka).then(function(rinci_penerima){
																if(
																	rinci_penerima == ''
																	|| !rinci_penerima
																){
																	return resolve_reduce3(nextData3);
																}
																var alamat = '';
																all_penerima.map(function(p, o){
																	if(p.id_profil == rinci_penerima.id_penerima){
																		alamat = p.alamat_teks+' - '+p.jenis_penerima;
																	}
																});
																var html_rinci = '<td '+_style.td_5+'>'+formatRupiah(current_data3.rincian)+'</td>';
																if(tahapan == 'pergeseran'){
																	html_rinci = ''
																		+'<td '+_style.td_5+'>'+formatRupiah(current_data3.rincian_murni)+'</td>'
																		+'<td '+_style.td_5+'>'+formatRupiah(current_data3.rincian)+'</td>'
																		+'<td '+_style.td_5+'>'+formatRupiah(current_data3.rincian_murni-current_data3.rincian)+'</td>';
																}
																penerimaHTML[current_data3.nomor] = ''
																	+'<tr class="tambahan">'
																		+'<td '+_style.td_1+'>'+current_data3.nomor+'</td>'
																		+'<td '+_style.td_2+'>'+current_data3.lokus_akun_teks+'</td>'
																		+'<td '+_style.td_3+'>'+alamat+' ('+current_data3.koefisien+' x '+current_data3.harga_satuan+')</td>'
																		+'<td '+_style.td_4+'>'+current_data3.nama_standar_harga.nama_komponen+'<br>'+current_data3.nama_standar_harga.spek_komponen+'</td>'
																		+html_rinci
																	+'</tr>';
										                    	return resolve_reduce3(nextData3);
															});
														});
									        		})
									                .catch(function(e){
									                    console.log(e);
									                    return Promise.resolve(nextData3);
									                });
									            })
									            .catch(function(e){
									                console.log(e);
									                return Promise.resolve(nextData3);
									            });
									        }, Promise.resolve(penerima[lastpenerima]))
									        .then(function(){
												console.log('dinas, subkeg, kelompok', dinas, subkeg, kelompok);
												jQuery(current_data2).after(penerimaHTML.join(''));
						        				resolve_reduce2(nextData2);
									        })
								            .catch(function(e){
								                console.log(e);
								                resolve_reduce2(nextData2);
								            });
									    })
							            .catch(function(e){
							                console.log(e);
							                resolve_reduce2(nextData2);
							            });
									});
								}else{
									console.log('tr skip', current_data2);
									resolve_reduce2(nextData2);
								}
			                })
			                .catch(function(e){
			                    console.log(e);
			                    return Promise.resolve(nextData2);
			                });
			            })
			            .catch(function(e){
			                console.log(e);
			                return Promise.resolve(nextData2);
			            });
			        }, Promise.resolve(tr[lasttr]))
			        .then(function(){
                		resolve_reduce(nextData);
			        });
                })
                .catch(function(e){
                    console.log(e);
                    return Promise.resolve(nextData);
                });
            })
            .catch(function(e){
                console.log(e);
                return Promise.resolve(nextData);
            });
        }, Promise.resolve(table[last]))
        .then(function(){
        	jQuery('#wrap-loading').hide();
        	window.print(true);
        });
	// RINGKASAN APBD YANG DIKLASIFIKASI MENURUT URUSAN PEMERINTAHAN DAERAH DAN ORGANISASI (APBD perda)
	// RINCIAN APBD MENURUT URUSAN PEMERINTAHAN DAERAH, ORGANISASI, PENDAPATAN, BELANJA DAN PEMBIAYAAN (APBD penjabaran)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/2/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		var bidang_urusan = {};
		var skpd = {};
		jQuery('table[cellpadding="3"]>tbody tr').map(function(i, b){
			var td = jQuery(b).find('td');
			var urusan = td.eq(0).text().trim();
			if(isNaN(urusan)){
				return;
			}
			var bidang = td.eq(1).text().trim();
			var nama = td.eq(3).text().trim();
			if(!bidang_urusan[urusan]){
				bidang_urusan = {};
				bidang_urusan[urusan] = {
					nama: nama
				};
			}
			if(bidang && !bidang_urusan[urusan][bidang]){
				bidang_urusan[urusan] = {
					nama: bidang_urusan[urusan].nama
				};
				bidang_urusan[urusan][bidang] = {
					nama: nama
				};
			}
			var kode_unit = td.eq(2).text().trim();
			if(kode_unit){
				var kodes = kode_unit.split('.');
				var cek = false;
				if(bidang_urusan[kodes[0]] && bidang_urusan[kodes[0]][kodes[1]]){
					cek = true;
				}else if(bidang_urusan[kodes[2]] && bidang_urusan[kodes[2]][kodes[3]]){
					cek = true;
				}else if(bidang_urusan[kodes[4]] && bidang_urusan[kodes[4]][kodes[5]]){
					cek = true;
				}
				if(!cek){
					console.log('bidang_urusan', bidang_urusan);
					if(!skpd[kode_unit]){
						skpd[kode_unit] = {
							nama: nama
						};
					}
					if(!skpd[kode_unit][urusan]){
						skpd[kode_unit][urusan] = {
							nama: bidang_urusan[urusan].nama
						};
					}
					if(!skpd[kode_unit][urusan][bidang]){
						skpd[kode_unit][urusan][bidang] = {
							nama: bidang_urusan[urusan][bidang].nama
						}
					}
				}
			}
		});
		// console.log('skpd', skpd);
		var lintas_urusan = '';
		var no = 0;
		for(var i in skpd){
			if(i=='nama'){ continue; }
			for(var j in skpd[i]){
				if(j=='nama'){ continue; }
				for(var k in skpd[i][j]){
					if(k=='nama'){ continue; }
					no++;
					lintas_urusan += ''
						+'<tr>'
							+'<td>'+no+'</td>'
							+'<td class="text_kiri">'+skpd[i].nama+'</td>'
							+'<td class="text_kiri">'+skpd[i][j].nama+'</td>'
							+'<td class="text_kiri">'+skpd[i][j][k].nama+'</td>'
						+'</tr>';
				}
			}
		};
		var skpd_lintas_urusan = ''
			+'<table class="border-table-sce">'
				+'<thead>'
					+'<tr>'
						+'<th colspan="4">Data SKPD Lintas Urusan</th>'
					+'</tr>'
					+'<tr>'
						+'<th>No</th>'
						+'<th>SKPD</th>'
						+'<th>Urusan</th>'
						+'<th>Bidang</th>'
					+'</tr>'
				+'</thead>'
				+'<tbody>'
					+lintas_urusan
				+'</tbody>'
			+'</table>';
		jQuery('#action-sipd').prepend(skpd_lintas_urusan);
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	// RINGKASAN APBD YANG DIKLASIFIKASI MENURUT KELOMPOK DAN JENIS PENDAPATAN, BELANJA, DAN PEMBIAYAAN (APBD perda)
	// RINGKASAN PENJABARAN APBD YANG DIKLASIFIKASI MENURUT KELOMPOK DAN JENIS PENDAPATAN, BELANJA, DAN PEMBIAYAAN (APBD penjabaran)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/1/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		var all_data = {
			nama: 'Total keseluruhan',
			total: 0
		};
		jQuery('table[cellpadding="3"] tbody tr').map(function(i, b){ 
			var td = jQuery(b).find('td');
			var kode = td.eq(0).text().trim().split('.');
			if(isNaN(kode[0]) || td.eq(0).text().trim() == ''){ return; }
			var nilai = +(td.eq(2).text().trim().replace(/\./g,''));
			var nama = td.eq(1).text().trim();
			if(kode.length == 1 && !all_data[kode[0]]){
				all_data[kode[0]] = {
					nama: nama,
					total: 0
				};
			}
			if(kode.length == 2 && !all_data[kode[0]][kode[1]]){
				all_data[kode[0]][kode[1]] = {
					nama: nama,
					total: 0
				};
			}
			if(kode.length == 3 && !all_data[kode[0]][kode[1]][kode[2]]){
				all_data[kode[0]][kode[1]][kode[2]] = {
					nama: nama,
					total: 0
				};
			}
			if(kode.length == 4 && !all_data[kode[0]][kode[1]][kode[2]][kode[3]]){
				all_data[kode[0]][kode[1]][kode[2]][kode[3]] = {
					nama: nama,
					total: 0
				};
			}
			if(kode.length == 5 && !all_data[kode[0]][kode[1]][kode[2]][kode[3]][kode[4]]){
				all_data[kode[0]][kode[1]][kode[2]][kode[3]][kode[4]] = {
					nama: nama,
					total: nilai
				};
				all_data[kode[0]][kode[1]][kode[2]][kode[3]].total += nilai;
				all_data[kode[0]][kode[1]][kode[2]].total += nilai;
				all_data[kode[0]][kode[1]].total += nilai;
				all_data[kode[0]].total += nilai;
				all_data.total += nilai;
			}
		});
		//console.log('all_data', all_data);
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/3/'+config.id_daerah+'/0') != -1){
		console.log('halaman perda lampiran 3');
		var download_excel = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="semua-halaman" style="float: right">'
				+'<i class="fa fa-print m-r-5"></i> <span>Print Semua Halaman</span>'
			+'</button>';
		jQuery('.col-md-10 h4').append(download_excel);
		jQuery('#semua-halaman').on('click', function(){
			jQuery('#wrap-loading').show();
			tampil_semua_halaman();
		});
	}else if(current_url.indexOf('setup-user/'+config.tahun_anggaran+'/kel-desa/'+config.id_daerah+'/0') != -1){
		console.log('halaman user kelurahan/desa');
		var singkron_lokal = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron-user-deskel-lokal" style="float: right">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron User Pengusul Kelurahan/Desa ke DB Lokal</span>'
			+'</button>';
		jQuery('.p-b-10 .pull-right').append(singkron_lokal);
		jQuery('#singkron-user-deskel-lokal').on('click', function(){
			jQuery('#wrap-loading').show();
			singkron_user_deskel_lokal();
		});
	}else if(current_url.indexOf(get_type_jadwal()+'/analisis/'+config.tahun_anggaran+'/bl/view/'+config.id_daerah+'/0') != -1){
		console.log('halaman analisis belanja');
		if(jQuery('#table_standar_harga').length >= 1){
			var tombol_detil = ''
				+'<button class="fcbtn btn btn-success btn-outline btn-1b" id="detil-analisis-belanja" style="float: right">'
					+'<i class="fa fa-eye m-r-5"></i> <span>Detail Akun/Rekening</span>'
				+'</button>';
			jQuery('.col-md-10 .box-title').append(tombol_detil);
			jQuery('#detil-analisis-belanja').on('click', function(){
				jQuery('#wrap-loading').show();
				detil_analisis_belanja();
			});
		}
	}else if(current_url.indexOf('setup-user/'+config.tahun_anggaran+'/anggota-dewan/'+config.id_daerah+'/0') != -1){
		console.log('halaman user anggota-dewan');
		var singkron_lokal = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron-user-dewan-lokal" style="float: right">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron User Anggota Dewan ke DB Lokal</span>'
			+'</button>';
		jQuery('.p-b-10 .pull-right').append(singkron_lokal);
		jQuery('#singkron-user-dewan-lokal').on('click', function(){
			jQuery('#wrap-loading').show();
			singkron_user_dewan_lokal();
		});
	 }else if(current_url.indexOf('/sipd/'+config.tahun_anggaran+'/setup/'+config.id_daerah+'/0') != -1){
		console.log('halaman setup sipd');
		var singkron_lokal = ''
	        +'<div class="col-xs-9">'
	                +'<button onclick="return false;" class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron-sipd-lokal" style="float: right">'
	                        +'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron ke DB Lokal</span>'
	                +'</button>'
	        +'</div>';
		jQuery('.m-t-20').append(singkron_lokal);
		jQuery('#singkron-sipd-lokal').on('click', function(){
	        jQuery('#wrap-loading').show();
	        singkron_pengaturan_sipd_lokal();
		});
	 }else if(current_url.indexOf('/renstra/'+config.tahun_anggaran+'/list/'+config.id_daerah+'/') != -1){
		console.log('halaman RENSTRA');
		var singkron_lokal = ''
            +'<button onclick="return false;" class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron-renstra-lokal" style="margin-left: 30px;">'
                    +'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron ke DB Lokal</span>'
            +'</button>';
		jQuery('#reset_program').after(singkron_lokal);
		jQuery('#singkron-renstra-lokal').on('click', function(){
	        jQuery('#wrap-loading').show();
	        singkron_renstra_lokal();
		});
	 }else if(
	 	jQuery('h3.page-title').text().indexOf('Pendapatan') != -1
	 ){
		console.log('halaman RKA pendapatan');
		var singkron_lokal = ''
            +'<button onclick="return false;" class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron-pendapatan-lokal" style="margin-left: 30px;">'
                    +'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron ke DB Lokal</span>'
            +'</button>';
        if(jQuery('.m-t-0 .button-box').length == 0){
			jQuery('.m-t-0').append('<div class="button-box pull-right p-t-20">'+singkron_lokal+'</div>');
        }else{
			jQuery('.m-t-0 .button-box').append(singkron_lokal);
        }
		jQuery('#singkron-pendapatan-lokal').on('click', function(){
			jQuery('#wrap-loading').show();
			jQuery('#persen-loading').attr('total', 1);
			jQuery('#persen-loading').html('0%');
			var id_unit = window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
			if (id_unit == 0) singkron_pendapatan_lokal_all_unit() 
			else {singkron_pendapatan_lokal(id_unit);}
		});
	}else if(
	 	jQuery('h3.page-title').text().indexOf('Pembiayaan') != -1
	){
		console.log('halaman RKA pembiayaan');
		var singkron_lokal = ''
            +'<button onclick="return false;" class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron-pembiayaan-lokal" style="margin-left: 30px;">'
                    +'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron ke DB Lokal</span>'
            +'</button>';
        if(jQuery('.m-t-0 .button-box').length == 0){
			jQuery('.m-t-0').append('<div class="button-box pull-right p-t-20">'+singkron_lokal+'</div>');
        }else{
			jQuery('.m-t-0 .button-box').append(singkron_lokal);
        }
		jQuery('#singkron-pembiayaan-lokal').on('click', function(){
			var id_unit = window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
	        jQuery('#wrap-loading').show();
			jQuery('#persen-loading').attr('total', 1);
			jQuery('#persen-loading').html('0%');
	        var type = 'pengeluaran';
	        if(
	        	jQuery('h3.page-title').text().indexOf('Penerimaan') != -1
	        ){
	        	type = 'penerimaan';
	        }
	       if (id_unit == 0) singkron_pembiayaan_lokal_all(type)
	       else singkron_pembiayaan_lokal(type,id_unit);
		});
	}else if(
	 	jQuery('h3.page-title').text().indexOf('Usulan Langsung (Masyarakat / Lembaga)') != -1
	){
		console.log('halaman Usulan Langsung (Masyarakat / Lembaga)');
		var singkron_lokal = ''
            +'<button onclick="return false;" class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron-asmas-lokal" style="margin-left: 30px;">'
                +'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron ke DB Lokal</span>'
            +'</button>'
			+ '<div style="background: white;padding: 25px;border: lightgrey;border-style: outset;border-width: thin;">'
			+ '<input type="file" id="excelfile" />'
			+ '<input type="button" class="fcbtn btn btn-danger btn-outline btn-1b" id="impor-usulan-apbd1" value="Impor Usulan APBD I ke SIPD" />'
			+'</div>';
		jQuery('.panel-heading').append(singkron_lokal);
		jQuery('#singkron-asmas-lokal').on('click', function(){
	        singkron_asmas_lokal();
		});
		jQuery('#impor-usulan-apbd1').on('click', function(){
	        impor_usulan_apbd1();
		});
	}else if(
	 	jQuery('h3.page-title').text().indexOf('Usulan Reses / Pokok Pikiran') != -1
	){
		console.log('halaman Usulan Reses / Pokok Pikiran');
		var singkron_lokal = ''
            +'<button onclick="return false;" class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron-pokir-lokal" style="margin-left: 30px;">'
                +'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron ke DB Lokal</span>'
            +'</button>';
		jQuery('.panel-heading').append(singkron_lokal);
		jQuery('#singkron-pokir-lokal').on('click', function(){
	        singkron_pokir_lokal();
		});
	}else if(current_url.indexOf('daerah/main/'+get_type_jadwal()+'/lampiran/'+config.tahun_anggaran+'/apbd/2/'+config.id_daerah+'/') != -1){
		console.log('Halaman APBD penjabaran lampiran 2');
		var tampil_apbd_penjabaran = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="tampil_apbd_penjabaran">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Tampilkan URL Lapiran APBD Lokal</span>'
			+'</button>';
		jQuery('.p-b-20 .col-md-2').append(tampil_apbd_penjabaran);
		jQuery('#tampil_apbd_penjabaran').on('click', function(){
			setLampiran('apbd', 'perkada', '2');
		});
	}

	if(jQuery('#mod-hist-jadwal .modal-header .btn-circle').length >= 1){
		jQuery('ul.nav-third-level > li > a').map(function(i, b){
			var onclick = jQuery(b).attr('onclick');
			if(onclick && onclick.indexOf('jadwalCetak') != -1){
				var _class = onclick.split("'");
				var n_class = _class[1]+'-'+_class[3]+'-'+_class[5];
				jQuery(b).addClass(n_class);
				jQuery('a.'+n_class).on('click', function(){
					var _class = jQuery(this).attr('onclick').split("'");
					setLampiran(_class[1], _class[3], _class[5]);
				});
			}
		});
	}
});

function impor_usulan_apbd1() {
	var lru3 = document.body.textContent.split('lru3 = "')[1].split('"')[0];
	var mycookie = document.cookie;
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;  
	/*Checks whether the file is a valid excel file*/  
	if (regex.test($("#excelfile").val().toLowerCase())) {  
		var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/  
		if ($("#excelfile").val().toLowerCase().indexOf("xlsx") > 0) {  
			xlsxflag = true;  
		}  
		/*Checks whether the browser supports HTML5*/  
		if (typeof (FileReader) != "undefined") {  
			var reader = new FileReader();  
			reader.onload = function (e) {  
				var data = e.target.result;  
				/*Converts the excel data in to object*/  
				if (xlsxflag) {  
					var workbook = XLSX.read(data, { type: 'binary' });  
				}  
				else {
					var workbook = XLS.read(data, { type: 'binary' });  
				}  
				/*Gets all the sheetnames of excel in to a variable*/  
				var sheet_name_list = workbook.SheetNames;  
 
				var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/  
				sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/  
					/*Convert the cell value to Json*/  
					if (xlsxflag) {  
						var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);  
					}  
					else {  
						var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);  
					}  
					if (exceljson.length > 0 && cnt == 0) {  
						//BindTable(exceljson, '#exceltable');  
						input_usulan_apbd1(exceljson,lru3,mycookie);
						cnt++;  
					}  
				});  
			}  
			if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/  
				reader.readAsArrayBuffer($("#excelfile")[0].files[0]);  
			}  
			else {  
				reader.readAsBinaryString($("#excelfile")[0].files[0]);  
			}  
		}  
		else {  
			alert("Sorry! Your browser does not support HTML5!");  
		}  
	}  
	else {  
		alert("Please upload a valid Excel file!");  
	}  
}  

function input_usulan_apbd1(jsondata,lru3,mycookie) {/*Function used to input the JSON array to Kamus Usulan SIPD*/  
	var columns = getHeader(jsondata); /*Gets all the column headings of Excel*/  
	//console.log(jsondata);
	for (var i = 0; i < jsondata.length; i++) {  
		for (var colIndex = 0; colIndex < columns.length; colIndex++) {  
			var cellValue = jsondata[i][columns[colIndex]];  
			if (cellValue == null) cellValue = "";  
		}
		var formDataCustom = window.formData;
		formDataCustom.delete('_token');
		formDataCustom.append('idusulan', '');
		formDataCustom.append('tujuanusul', jsondata[i]['tujuanusul']);
		formDataCustom.append('idkamus', jsondata[i]['idkamus']);
		formDataCustom.append('volume', '');
		formDataCustom.append('satuan', '');
		formDataCustom.append('harga_satuan', '');
		formDataCustom.append('masalah_teks', jsondata[i]['masalah_teks']);
		formDataCustom.append('alamat_teks', jsondata[i]['alamat_teks']);
		formDataCustom.append('lat_peta', '');
		formDataCustom.append('lang_peta', '');
		formDataCustom.append('kab_kota', jsondata[i]['kab_kota']);
		formDataCustom.append('kecamatan', null);
		formDataCustom.append('kelurahan', null);
		formDataCustom.append('suratproposal', jsondata[i]['suratproposal']);
		formDataCustom.append('foto', jsondata[i]['foto']);
		formDataCustom.append('foto_2', jsondata[i]['foto_2']);
		formDataCustom.append('foto_3', jsondata[i]['foto_3']);

		jQuery.ajax({
		    url: lru3,
			type: 'post',
			data: formDataCustom,
			headers: {
				"X-CSRF-Token": tokek
			},
			processData: false,
			contentType: false,
		    success:function(ret){
		        console.log('Input Usulan APBD I',ret);
		    },
		    error:function(){
				console.log('Input Usulan APBD I');
		    }      
		});
	}  
}  

function getHeader(jsondata) {/*Function used to get all column names from JSON*/  
	var columnSet = [];  
	for (var i = 0; i < jsondata.length; i++) {  
		var rowHash = jsondata[i];  
		for (var key in rowHash) {  
			if (rowHash.hasOwnProperty(key)) {  
				if ($.inArray(key, columnSet) == -1) {/*Adding each unique column names to a variable array*/  
					columnSet.push(key);  
				}  
			}  
		}  
	}  
	// console.log(columnSet);
	return columnSet;  
}  

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function tampil_semua_halaman(){
	(function runAjax(retries, delay){
		delay = delay || 30000;
	jQuery.ajax({
		url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/lampiran/'+config.tahun_anggaran+'/apbd/tampil-unit/'+config.id_daerah+'/0',
			type: 'get',
			timeout: 30000,
			success: function(unit){
				var sendData = unit.data.map(function(b, i){
					return new Promise(function(resolve, reject){
						jQuery.ajax({
							url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/jadwal/'+config.tahun_anggaran+'/hist-jadwal/'+config.id_daerah+'/0',
							type: "post",
							timeout: 30000,
							data: "_token="+tokek+'&app=budget&cetak=apbd&model=perda&jenis=3'+'&idskpd='+b.id_skpd+'&idbl=0&idsubbl=0',
							success: function(jadwal){
								var url = jQuery(jadwal.data.filter(function(j, n){
									return j.setstatus == "Aktif";
								})[0].action).attr('href');
								b.url = url;
								// return resolve(b);
								jQuery.ajax({
									url: url,
									type: "get",
									success: function(web){
										b.web = jQuery('<div>'+web+'</div>').find('.cetak').html();
										return resolve(b);
									}
								});
							}
						});
					})
					.catch(function(e){
						console.log(e);
						return Promise.resolve({});
					});
				});
				Promise.all(sendData)
				.then(function(all_unit){
					// console.log('all_unit', all_unit);
					var all_data = [];
					all_unit.map(function(b, i){
						all_data.push(b.web);
					});
					jQuery('head').html('<title>Sistem Informasi Pemerintahan Daerah - Lampiran 3 APBD</title>');
					jQuery('body').html('<div class="cetak">'+all_data.join('<div style="page-break-after:always;"></div>')+'</div>');
					jQuery('#wrap-loading').hide();
					ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'), 12);
					window.history.pushState({"html":'',"pageTitle":'good'},"", '/sce');
					window.print();
				})
				.catch(function(err){
					console.log('err', err);
					alert('Ada kesalahan sistem!');
					jQuery('#wrap-loading').hide();
				});
			}
		})
		.fail(function(){
			console.log('Koneksi error. Coba lagi'+retries); // prrint retry count
			retries > 0 && setTimeout(function(){
				runAjax(--retries,30000);
			},delay);
		})
	})(20, 30000);
}

function singkron_skpd_ke_lokal(tampil_renja){
	if(tampil_renja && typeof data_unit != 'undefined'){
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
		return;
	}
	swal({
		title: "Peringatan!",
		text: "Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.",
		icon: "warning",
		buttons: true,
		// dangerMode: true,
	  })
	.then((confirm) => {
	if (confirm) {
	// if(confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
		jQuery('#wrap-loading').show();
		var id_unit = window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
		(function runAjax(retries, delay){
			delay = delay || 30000;
			jQuery.ajax({
				//url: config.sipd_url+'daerah/main/plan/belanja/'+config.tahun_anggaran+'/giat/tampil-unit/'+config.id_daerah+'/0',
				url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/belanja/'+config.tahun_anggaran+'/giat/tampil-unit/'+config.id_daerah+'/0',
				type: 'get',
				timeout: 30000,
				success: function(units){
					var last = units.data.length-1;
					units.data.reduce(function(sequence, nextData){
						return sequence.then(function(current_data){
							return new Promise(function(resolve_reduce, reject_reduce){
								var opsi = { 
									action: 'set_unit_pagu',
									api_key: config.api_key,
									tahun_anggaran: config.tahun_anggaran,
									data : {
										batasanpagu : current_data.batasanpagu,
										id_daerah : current_data.id_daerah,
										id_level : current_data.id_level,
										id_skpd : current_data.id_skpd,
										id_unit : current_data.id_skpd,
										id_user : current_data.id_user,
										is_anggaran : current_data.is_anggaran,
										is_deleted : current_data.is_deleted,
										is_komponen : current_data.is_komponen,
										is_locked : current_data.is_locked,
										is_skpd : current_data.is_skpd,
										kode_skpd : current_data.kode_skpd,
										kunci_bl : current_data.kunci_bl,
										kunci_bl_rinci : current_data.kunci_bl_rinci,
										kuncibl : current_data.kuncibl,
										kunciblrinci : current_data.kunciblrinci,
										nilaipagu : current_data.nilaipagu,
										nilaipagumurni : current_data.nilaipagumurni,
										nilairincian : current_data.nilairincian,
										pagu_giat : current_data.pagu_giat,
										realisasi : current_data.realisasi,
										rinci_giat : current_data.rinci_giat,
										set_pagu_giat : current_data.set_pagu_giat,
										set_pagu_skpd : current_data.set_pagu_skpd,
										tahun : current_data.tahun,
										total_giat : current_data.total_giat,
										totalgiat : current_data.totalgiat
									}
								};
								var data = {
									message:{
										type: "get-url",
										content: {
											url: config.url_server_lokal,
											type: 'post',
											data: opsi,
											return: false
										}
									}
								};
								chrome.runtime.sendMessage(data, function(response) {
									console.log('Proses wp action set_unit_pagu: '+current_data.kode_skpd, response);
									resolve_reduce(nextData);
								});
							})
							.catch(function(e){
								console.log(e);
								return Promise.resolve(nextData);
							});
						})
						.catch(function(e){
							console.log(e);
							return Promise.resolve(nextData);
						});
					}, Promise.resolve(units.data[last]))
					.then(function(data_last){
						console.log('Selesai memproses set unit pagu! Sampai data ke-',data_last.kode_skpd);
					})
					.catch(function(e){
						console.log(e);
					});
				}
			})
			.fail(function(){
				console.log('Koneksi error. Coba lagi'+retries+' pengambilan data tampil-unit'); // prrint retry count
				retries > 0 && setTimeout(function(){
					runAjax(--retries,30000);
				},delay);
			})
		})(5, 30000);
		(function runAjax1(retries, delay){
			delay = delay || 30000;
			jQuery.ajax({
				url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/skpd/'+config.tahun_anggaran+'/tampil-skpd/'+config.id_daerah+'/'+id_unit,
				//url: config.sipd_url+'daerah/main/budget/skpd/'+config.tahun_anggaran+'/tampil-skpd/'+config.id_daerah+'/'+id_unit,
				//tampil-skpd: seluruh skpd dan sub skpd, tampil-unit: skpd dan sub skpd yg menjadi penandatangan rka.
				type: 'get',
				timeout: 30000,
				success: function(unit){
					var sendData = unit.data.map(function(b, i){
						return new Promise(function(resolve, reject){
							(function runAjax2(retries, delay){
								delay = delay || 30000;
								jQuery.ajax({
									url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/skpd/'+config.tahun_anggaran+'/detil-skpd/'+config.id_daerah+'/0',
									//url: config.sipd_url+"daerah/main/budget/skpd/"+config.tahun_anggaran+"/detil-skpd/"+config.id_daerah+"/0",
									type: "post",
									timeout: 30000,
									data: "_token="+tokek+'&idskpd='+b.id_skpd,
									success: function(data){
										// jangan gunakan kata unit dari url tampil-skpd dan detil-skpd karena dikhawatirkan tidak konsisten (beda user yg akses bisa beda nilai yang diberikan).
										// id_unit dari url tampil-skpd menunjuk ke induk organisasi, sedangkan skpd menunjuk ke sub skpd. var sub skpd tidak ada.
										// kode unit dan nama unit dari url detil-skpd (var data_unit) menunjuk ke sub skpd.
										// solusi: id_unit, kode_unit, nama_unit dihilangkan saat singkron_unit (pengiriman data ke db lokal) dari data url tampil-skpd dan detil-skpd.
										// fokuskan ke id_skpd, kode_skpd, nama_skpd (diisi dengan data sub skpd). idinduk (induk organisasi) masuk.
										// di db lokal untuk tabel data_unit: skpd mencakup skpd dan sub skpd, unit = penandatangan rka, induk = induk organisasi.
										// jika id_setup_unit kosong berarti penandatangan rka = induk organisasi, jika terisi berarti penandatangan rka = skpd/sub skpd itu sendiri.
										if (!b.id_setup_unit) {
											id_unit = data.idinduk;
										} else {
											id_unit = b.id_skpd;
										}
										var data_unit = {
											id_setup_unit : b.id_setup_unit,
											id_unit: id_unit,
											id_skpd : b.id_skpd,
											is_skpd : b.is_skpd,
											kode_skpd : b.kode_skpd,
											kunci_skpd : b.kunci_skpd,
											nama_skpd : b.nama_skpd,
											posisi : b.posisi,
											status : b.status,
											bidur_1 : data.bidur_1,
											bidur_2 : data.bidur_2,
											bidur_3 : data.bidur_3,
											idinduk : data.idinduk,
											ispendapatan : data.ispendapatan,
											isskpd : data.isskpd,
											kode_skpd_1 : data.kode_skpd_1,
											kode_skpd_2 : data.kode_skpd_2,
											komisi : data.komisi,
											namabendahara : data.namabendahara,
											namakepala : data.namakepala,
											nipbendahara : data.nipbendahara,
											nipkepala : data.nipkepala,
											pangkatkepala : data.pangkatkepala,
											setupunit : data.setupunit,
											statuskepala : data.statuskepala,
										};
										return resolve(data_unit);
									}
								})
								.fail(function(){
									console.log("Mencoba ke-"+retries+" mengambil data detil-skpd"); // prrint retry count
									retries > 0 && setTimeout(function(){
										runAjax2(--retries,30000);
									},delay);
								})
							})(20, 30000);
						})
						.catch(function(e){
							console.log(e);
							return Promise.resolve({});
						});
					});

					Promise.all(sendData)
					.then(function(all_unit){
						var opsi = { 
							action: 'singkron_unit',
							api_key: config.api_key,
							data_unit : all_unit,
							tahun_anggaran : config.tahun_anggaran
						};
						var data = {
							message:{
								type: "get-url",
								content: {
									url: config.url_server_lokal,
									type: 'post',
									data: opsi,
									return: true
								}
							}
						};
						chrome.runtime.sendMessage(data, function(response) {
							console.log('responeMessage', response);
						});
					})
					.catch(function(err){
						console.log('err', err);
						alert('Ada kesalahan sistem!');
						jQuery('#wrap-loading').hide();
					});
				}
			})
			.fail(function(){
				console.log('Koneksi error. Coba lagi'+retries+' pengambilan data tampil-skpd', id_unit); // prrint retry count
				retries > 0 && setTimeout(function(){
					runAjax1(--retries);
				},delay);
			})
		})(20);
	}});
}

async function singkron_rka_ke_lokal_all(opsi_unit, callback) {
	if((opsi_unit && opsi_unit.id_skpd) || confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
		if (!opsi_unit) jQuery('#wrap-loading').show();
		var id_unit = idune;
		var tahap = window.location.href.split('/')[5];
		if(opsi_unit && opsi_unit.id_skpd){
			// id_skpd: asumsi data opsi_unit diperoleh dari url giat/tampil-unit jadi id_skpd yg diperoleh adalah id skpd/sub skpd penandatangan rka, bukan induk organisasi.
			// id_unit: penggunaan id_unit dari sipd tidak konsiten (akses oleh tapd: id_unit adl induk organisasi, akses mitra id_unit adl id penandatangan rka.
			// di db lokal untuk tabel data_unit_pagu disamakan antara id_unit dengan id_skpd (id_sub_skpd) tapi hanya ada skpd dan sub skpd penandatangan rka, 
			// di db lokal untuk tabel data_unit_pagu tidak diadakan id skpd induk organisasi.
			id_unit = opsi_unit.id_skpd;
			var opsi = { 
				action: 'set_unit_pagu',
				api_key: config.api_key,
				tahun_anggaran: config.tahun_anggaran,
				data : {
					batasanpagu : opsi_unit.batasanpagu,
					id_daerah : opsi_unit.id_daerah,
					id_level : opsi_unit.id_level,
					id_skpd : opsi_unit.id_skpd,
					id_unit : opsi_unit.id_skpd,
					id_user : opsi_unit.id_user,
					is_anggaran : opsi_unit.is_anggaran,
					is_deleted : opsi_unit.is_deleted,
					is_komponen : opsi_unit.is_komponen,
					is_locked : opsi_unit.is_locked,
					is_skpd : opsi_unit.is_skpd,
					kode_skpd : opsi_unit.kode_skpd,
					kunci_bl : opsi_unit.kunci_bl,
					kunci_bl_rinci : opsi_unit.kunci_bl_rinci,
					kuncibl : opsi_unit.kuncibl,
					kunciblrinci : opsi_unit.kunciblrinci,
					nilaipagu : opsi_unit.nilaipagu,
					nilaipagumurni : opsi_unit.nilaipagumurni,
					nilairincian : opsi_unit.nilairincian,
					pagu_giat : opsi_unit.pagu_giat,
					realisasi : opsi_unit.realisasi,
					rinci_giat : opsi_unit.rinci_giat,
					set_pagu_giat : opsi_unit.set_pagu_giat,
					set_pagu_skpd : opsi_unit.set_pagu_skpd,
					tahun : opsi_unit.tahun,
					total_giat : opsi_unit.total_giat,
					totalgiat : opsi_unit.totalgiat
				}
			};
			var data = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: opsi,
		    			return: false
					}
			    }
			};
			chrome.runtime.sendMessage(data, function(response) {
			    console.log('Proses wp action set_unit_pagu: '+id_unit, response);
			});
		} else {
			jQuery('#persen-loading').attr('progress', 0);
			jQuery('#persen-loading').html('0%');
			jQuery('#persen-loading').attr('total', 0);
		}
		console.log('Memulai proses untuk unit:', id_unit);
		var url_get_unit = lru8;
		if(opsi_unit && opsi_unit.kode_get){
			url_get_unit = opsi_unit.kode_get;
		}
		(function runAjax(retries, delay){
			delay = delay || 30000;
			jQuery.ajax({
				url: url_get_unit,
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				timeout: 30000,
				success: function(subkeg){
					var cat_wp = '';
					var last = subkeg.data.length-1;
					console.log('Sub kegiatan '+id_unit+' sebanyak',subkeg.data.length);
					var c_total = +jQuery('#persen-loading').attr('total')+subkeg.data.length;
					var c_progress = +jQuery('#persen-loading').attr('progress');
					jQuery('#persen-loading').attr('total', c_total);
					jQuery('#persen-loading').attr('progress', c_progress);
					jQuery('#persen-loading').html((((c_progress)/c_total)*100).toFixed(2)+'%'+'<br>');
					subkeg.data.reduce(function(sequence, nextData){
						return sequence.then(function(current_data){
							return new Promise(function(resolve_reduce, reject_reduce){
								if(current_data.nama_sub_giat.mst_lock != 3 && current_data.kode_sub_skpd){
									//console.log('Memproses singkron_rka_ke_lokal untuk sub kegiatan', current_data.kode_sbl+' di '+current_data.nama_sub_skpd+' atau di '+current_data.nama_skpd);
									cat_wp = current_data.nama_sub_skpd;
									var nama_skpd = current_data.nama_skpd.split(' ');
									nama_skpd.shift();
									nama_skpd = nama_skpd.join(' ');
									singkron_rka_ke_lokal({
										id_unit: id_unit,
										action: current_data.action,
										id_skpd: current_data.id_skpd,
										id_sub_skpd: current_data.id_sub_skpd,
										kode_bl: current_data.kode_bl,
										kode_sbl: current_data.kode_sbl,
										idbl: current_data.id_bl,
										idsubbl: current_data.id_sub_bl,
										kode_skpd: current_data.kode_skpd,
										nama_skpd: nama_skpd,
										kode_sub_skpd: current_data.kode_sub_skpd,
										nama_sub_skpd: current_data.nama_sub_skpd,
										pagu: current_data.pagu,
										no_return: true
									}, function(){
										var c_total = +jQuery('#persen-loading').attr('total');
										var c_progress = +jQuery('#persen-loading').attr('progress')+1;
										jQuery('#persen-loading').attr('total', c_total);
										jQuery('#persen-loading').attr('progress', c_progress);
										jQuery('#persen-loading').html((((c_progress)/c_total)*100).toFixed(2)+'%'+'<br>');
										if (c_progress == c_total) {
											var opsi = { 
												action: 'get_cat_url',
												api_key: config.api_key,
												category : cat_wp
											};
											var data = {
												message:{
													type: "get-url",
													content: {
														url: config.url_server_lokal,
														type: 'post',
														data: opsi,
														return: true
													}
												}
											};
											chrome.runtime.sendMessage(data, function(response) {
												console.log('Selesai memproses sub kegiatan terakhir.', response);
											});
										}
										//console.log('Selanjutnya akan memproses sub kegiatan:', nextData.kode_sbl);
										resolve_reduce(nextData);
									});
								}else{
									resolve_reduce(nextData);
								}
							})
							.catch(function(e){
								console.log(e);
								return Promise.resolve(nextData);
							});
						})
						.catch(function(e){
							console.log(e);
							return Promise.resolve(nextData);
						});
					}, Promise.resolve(subkeg.data[last]))
					.then(function(data_last){
						if(callback){
							return callback();
						}else{
							var opsi = { 
								action: 'get_cat_url',
								api_key: config.api_key,
								category : cat_wp
							};
							var data = {
								message:{
									type: "get-url",
									content: {
										url: config.url_server_lokal,
										type: 'post',
										data: opsi,
										return: true
									}
								}
							};
							chrome.runtime.sendMessage(data, function(response) {
								//console.log('Selesai memproses sub kegiatan terakhir untuk '+id_unit, response);
							});
						}
					})
					.catch(function(e){
						console.log(e);
					});
				}
			})
			.fail(function(){
				console.log('Koneksi error. Coba lagi'+retries); // prrint retry count
				retries > 0 && setTimeout(function(){
					runAjax(--retries);
				},delay);
			})
		})(20);
		//console.log('Selesai memproses untuk unit', id_unit);
	}
}

function singkron_rka_ke_lokal(opsi, callback) {
	if((opsi && opsi.kode_bl) || confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
		jQuery('#wrap-loading').show();
		var id_unit = idune;
		var tahap = window.location.href.split('/')[5];
		if(opsi && opsi.id_unit){
			id_unit = opsi.id_unit;
		}
		var kode_sbl = false;
		var kode_bl = false;
		var idbl = false;
		var idsubbl = false;
		var kode_skpd = false;
		var nama_skpd = false;
		var kode_sub_skpd = false;
		var pagu = 0;
		if(!opsi || !opsi.kode_bl){
			kode_sbl = kodesbl;
			var _kode_bl = kode_sbl.split('.');
			_kode_bl.pop();
			kode_bl = _kode_bl.join('.');
			idbl = kode_bl;
			idsubbl = kode_sbl;
		}else{
			id_skpd = opsi.id_skpd;
			id_sub_skpd = opsi.id_sub_skpd;
			kode_bl = opsi.kode_bl;
			kode_sbl = opsi.kode_sbl;
			if (idsubbl) {
				idbl = opsi.idbl;
				idsubbl = opsi.idsubbl;
			} else {
				_kode_sbl = kode_sbl.split('.');
				idbl = _kode_sbl[2];
				idsubbl = _kode_sbl[3];
			}
			kode_skpd = opsi.kode_skpd;
			nama_skpd = opsi.nama_skpd;
			kode_sub_skpd = opsi.kode_sub_skpd;
			nama_sub_skpd = opsi.nama_sub_skpd;
			pagu = opsi.pagu;
		}
		if((idbl && idsubbl) || kode_sbl){
			// get detail SKPD
			get_detail_skpd(id_unit).then(function(data_unit){
				get_kode_from_rincian_page(opsi, kode_sbl).then(function(kode_get){
					if(opsi && opsi.action){
						kode_get = opsi.action.split("detilGiat('")[1].split("'")[0];
					}
					// get detail indikator kegiatan
					(function runAjax1(retries, delay){
						delay = delay || 30000;
						jQuery.ajax({
							url: endog+'?'+kode_get,
							type: 'post',
							timeout: 30000,
							data: formData,
							processData: false,
							contentType: false,
							success: function(subkeg){
								var kode_go_hal_rinci = {
									go_rinci: false,
									kode: lru1
								};
								if(opsi && opsi.action){
									kode_go_hal_rinci.go_rinci = true;
									kode_go_hal_rinci.kode = 'main?'+opsi.action.split("href='main?")[1].split("'")[0];
								}
	
								go_halaman_detail_rincian(kode_go_hal_rinci).then(function(kode_get_rinci){
									// subkeg = JSON.parse(subkeg);
									// get rincian belanja
									(function runAjax2(retries, delay){
										delay = delay || 30000;
										jQuery.ajax({
											url: kode_get_rinci,
											type: 'post',
											data: formData,
											processData: false,
											contentType: false,
											timeout: 30000,
											success: function(data){
												var data_rka = { 
													action: 'singkron_rka',
													tahun_anggaran: config.tahun_anggaran,
													api_key: config.api_key,
													rka : {},
													id_skpd: data.data[0].id_skpd,
													kode_skpd: data.data[0].kode_skpd,
													nama_skpd: data.data[0].nama_skpd,
													id_sub_skpd: data.data[0].id_sub_skpd,
													kode_sub_skpd: data.data[0].kode_sub_skpd,
													nama_sub_skpd: data.data[0].nama_sub_skpd,
													pagu: pagu,
													idbl: idbl,
													idsubbl: idsubbl,
													kode_bl: kode_bl,
													kode_sbl: kode_sbl,
													data_unit: {},
													dataBl: {},
													dataCapaian: {},
													dataDana: {},
													dataLb7: {},
													dataTag: {},
													dataEs3: {},
													dataHasil: {},
													dataOutput: {},
													dataLokout: {},
													dataOutputGiat: {},
												};
												for(var j in data_unit){
													data_rka.data_unit[j] = data_unit[j];
												}
												// data dari url tampil-rincian lebih pas dalam penggunaan kata skpd (=induk organisasi) dan sub skpd, untuk unit hanya mencantumkan id_unit
												// padahal tabel data_unit mencantumkan unit, skpd dan induk (untuk induk hanya mencantumkan idinduk) 
												// di coding ini diputuskan bahwa pada tabel data_unit
												// - skpd menunjuk ke satuan organisasi (baik itu skpd ataupun sub skpd)
												// - induk menunjuk ke satuan organisasi yang merupakan induk organisasi dari skpd/sub skpd di atas
												// - unit menunjuk ke satuan organisasi penandatangan RKA (bisa sub skpd itu sendiri ataupun induk organisasi, tergantung pengaturan profil)
												// maka: 																		
												// - id_unit, idinduk, id_skpd, kode_skpd, nama_skpd dari url tampil-rincian (var data_rka), dengan perubahan: sub jadi skpd. 
												// - bisa dilengkapi kode_induk dan nama_induk dari url tampil-rincian (var data_rka), yaitu dari kode_skpd dan nama_skpd
												// jangan gunakan kata unit dari url tampil-skpd dan detil-skpd karena dikhawatirkan tidak konsisten (beda user yg akses bisa beda nilai yang diberikan)
												// id_unit dari url tampil-skpd menunjuk ke induk organisasi, sedangkan skpd menunjuk ke sub skpd. var sub skpd tidak ada
												// kode unit dan nama unit dari url detil-skpd (var data_unit) menunjuk ke sub skpd
												// solusi: hilangkan id_unit, kode_unit, nama_unit saat singkron_unit (pengiriman data ke wp-sipd) dari data url tampil-skpd dan detil-skpd
												// fokuskan ke id_skpd, kode_skpd, nama_skpd (diisi dengan data sub skpd)
												delete data_rka.data_unit.kodeunit;
												delete data_rka.data_unit.namaunit;
												data_rka.data_unit['id_skpd'] = data_rka.id_sub_skpd;
												data_rka.data_unit['idinduk'] = data_rka.id_skpd;
												data_rka.data_unit['id_unit'] = data_rka.id_unit;
												data_rka.data_unit['kode_skpd'] = data_rka.kode_sub_skpd;
												data_rka.data_unit['nama_skpd'] = data_rka.nama_sub_skpd;
												data_rka.data_unit['kode_skpd'] = data_rka.kode_sub_skpd;
												data_rka.data_unit['nama_skpd'] = data_rka.nama_sub_skpd;
												subkeg.dataOutputGiat.map(function(d, i){
													data_rka.dataOutputGiat[i] = {};
													data_rka.dataOutputGiat[i].outputteks = d.outputteks;
													data_rka.dataOutputGiat[i].satuanoutput = d.satuanoutput;
													data_rka.dataOutputGiat[i].targetoutput = d.targetoutput;
													data_rka.dataOutputGiat[i].targetoutputteks = d.targetoutputteks;
												});
												subkeg.dataLokout.map(function(d, i){
													data_rka.dataLokout[i] = {};
													data_rka.dataLokout[i].camatteks = d.camatteks;
													data_rka.dataLokout[i].daerahteks = d.daerahteks;
													data_rka.dataLokout[i].idcamat = d.idcamat;
													data_rka.dataLokout[i].iddetillokasi = d.iddetillokasi;
													data_rka.dataLokout[i].idkabkota = d.idkabkota;
													data_rka.dataLokout[i].idlurah = d.idlurah;
													data_rka.dataLokout[i].lurahteks = d.lurahteks;
												});
												subkeg.dataOutput.map(function(d, i){
													data_rka.dataOutput[i] = {};
													data_rka.dataOutput[i].outputteks = d.outputteks;
													data_rka.dataOutput[i].targetoutput = d.targetoutput;
													data_rka.dataOutput[i].satuanoutput = d.satuanoutput;
													data_rka.dataOutput[i].idoutputbl = d.idoutputbl;
													data_rka.dataOutput[i].targetoutputteks = d.targetoutputteks;
												});
												subkeg.dataHasil.map(function(d, i){
													data_rka.dataHasil[i] = {};
													data_rka.dataHasil[i].hasilteks = d.hasilteks;
													data_rka.dataHasil[i].satuanhasil = d.satuanhasil;
													data_rka.dataHasil[i].targethasil = d.targethasil;
													data_rka.dataHasil[i].targethasilteks = d.targethasilteks;
												});
												subkeg.dataEs3.map(function(d, i){

												});
												subkeg.dataTag.map(function(d, i){
													data_rka.dataTag[i] = {};
													data_rka.dataTag[i].idlabelgiat = d.idlabelgiat;
													data_rka.dataTag[i].namalabel = d.namalabel;
													data_rka.dataTag[i].idtagbl = d.idtagbl;

												});
												subkeg.dataLb7.map(function(d, i){

												});
												subkeg.dataDana.map(function(d, i){
													data_rka.dataDana[i] = {};
													data_rka.dataDana[i].namadana = d.namadana;
													data_rka.dataDana[i].kodedana = d.kodedana;
													data_rka.dataDana[i].iddana = d.iddana;
													data_rka.dataDana[i].iddanasubbl = d.iddanasubbl;
													data_rka.dataDana[i].pagudana = d.pagudana;
												});
												subkeg.dataBl.map(function(d, i){
													data_rka.dataBl[i] = {};
													data_rka.dataBl[i].id_sub_skpd = d.id_sub_skpd;
													data_rka.dataBl[i].id_lokasi = d.id_lokasi;
													data_rka.dataBl[i].id_label_kokab = d.id_label_kokab;
													data_rka.dataBl[i].nama_dana = d.nama_dana;
													data_rka.dataBl[i].no_sub_giat = d.no_sub_giat;
													data_rka.dataBl[i].kode_giat = d.kode_giat;
													data_rka.dataBl[i].id_program = d.id_program;
													data_rka.dataBl[i].nama_lokasi = d.nama_lokasi;
													data_rka.dataBl[i].waktu_akhir = d.waktu_akhir;
													data_rka.dataBl[i].pagu_n_lalu = d.pagu_n_lalu;
													data_rka.dataBl[i].id_urusan = d.id_urusan;
													data_rka.dataBl[i].id_unik_sub_bl = d.id_unik_sub_bl;
													data_rka.dataBl[i].id_sub_giat = d.id_sub_giat;
													data_rka.dataBl[i].label_prov = d.label_prov;
													data_rka.dataBl[i].kode_program = d.kode_program;
													data_rka.dataBl[i].kode_sub_giat = d.kode_sub_giat;
													data_rka.dataBl[i].no_program = d.no_program;
													data_rka.dataBl[i].kode_urusan = d.kode_urusan;
													data_rka.dataBl[i].kode_bidang_urusan = d.kode_bidang_urusan;
													data_rka.dataBl[i].nama_program = d.nama_program;
													data_rka.dataBl[i].target_4 = d.target_4;
													data_rka.dataBl[i].target_5 = d.target_5;
													data_rka.dataBl[i].id_bidang_urusan = d.id_bidang_urusan;
													data_rka.dataBl[i].nama_bidang_urusan = d.nama_bidang_urusan;
													data_rka.dataBl[i].target_3 = d.target_3;
													data_rka.dataBl[i].no_giat = d.no_giat;
													data_rka.dataBl[i].id_label_prov = d.id_label_prov;
													data_rka.dataBl[i].waktu_awal = d.waktu_awal;
													data_rka.dataBl[i].pagu = d.pagu;
													data_rka.dataBl[i].output_sub_giat = d.output_sub_giat;
													data_rka.dataBl[i].sasaran = d.sasaran;
													data_rka.dataBl[i].indikator = d.indikator;
													data_rka.dataBl[i].id_dana = d.id_dana;
													data_rka.dataBl[i].nama_sub_giat = d.nama_sub_giat;
													data_rka.dataBl[i].pagu_n_depan = d.pagu_n_depan;
													data_rka.dataBl[i].satuan = d.satuan;
													data_rka.dataBl[i].id_rpjmd = d.id_rpjmd;
													data_rka.dataBl[i].id_giat = d.id_giat;
													data_rka.dataBl[i].id_label_pusat = d.id_label_pusat;
													data_rka.dataBl[i].nama_giat = d.nama_giat;
													data_rka.dataBl[i].id_skpd = d.id_skpd;
													data_rka.dataBl[i].id_sub_bl = d.id_sub_bl;
													data_rka.dataBl[i].nama_sub_skpd = d.nama_sub_skpd;
													data_rka.dataBl[i].target_1 = d.target_1;
													data_rka.dataBl[i].nama_urusan = d.nama_urusan;
													data_rka.dataBl[i].target_2 = d.target_2;
													data_rka.dataBl[i].label_kokab = d.label_kokab;
													data_rka.dataBl[i].label_pusat = d.label_pusat;
													data_rka.dataBl[i].id_bl = d.id_bl;
												});
												subkeg.dataCapaian.map(function(d, i){
													data_rka.dataCapaian[i] = {};
													data_rka.dataCapaian[i].satuancapaian = d.satuancapaian;
													data_rka.dataCapaian[i].targetcapaianteks = d.targetcapaianteks;
													data_rka.dataCapaian[i].capaianteks = d.capaianteks;
													data_rka.dataCapaian[i].targetcapaian = d.targetcapaian;
												});

												// var _leng = 250;
												var _data_all = [];
												var _data = [];
												data.data.map(function(rka, i){
													var _rka = {};
													_rka.created_user = rka.created_user;
													_rka.createddate = rka.createddate;
													_rka.createdtime = rka.createdtime;
													_rka.harga_satuan = rka.harga_satuan;
										_rka.harga_satuan_murni = rka.harga_satuan_murni;
													_rka.id_daerah = rka.id_daerah;
													_rka.id_rinci_sub_bl = rka.id_rinci_sub_bl;
													_rka.id_standar_nfs = rka.id_standar_nfs;
													_rka.is_locked = rka.is_locked;
													_rka.jenis_bl = rka.jenis_bl;
													_rka.ket_bl_teks = rka.ket_bl_teks;
													_rka.kode_akun = rka.kode_akun;
													_rka.koefisien = rka.koefisien;
										_rka.koefisien_murni = rka.koefisien_murni;
													_rka.lokus_akun_teks = rka.lokus_akun_teks;
													_rka.nama_akun = rka.nama_akun;
													if(rka.nama_standar_harga && rka.nama_standar_harga.nama_komponen){
														_rka.nama_komponen = rka.nama_standar_harga.nama_komponen;
														_rka.spek_komponen = rka.nama_standar_harga.spek_komponen;
													}else{
														_rka.nama_komponen = '';
														_rka.spek_komponen = '';
													}
													if(rka.satuan){
														_rka.satuan = rka.satuan;
													}else if (rka.koefisien) {
														_rka.satuan = rka.koefisien.split(' ');
														_rka.satuan.shift();
														_rka.satuan = _rka.satuan.join(' ');
													}
													_rka.sat1 = rka.sat_1;
													_rka.sat2 = rka.sat_2;
													_rka.sat3 = rka.sat_3;
													_rka.sat4 = rka.sat_4;
													_rka.spek = rka.spek;
													_rka.volum1 = rka.vol_1;
													_rka.volum2 = rka.vol_2;
													_rka.volum3 = rka.vol_3;
													_rka.volum4 = rka.vol_4;
										_rka.volume = rka.volume;
										_rka.volume_murni = rka.volume_murni;
													_rka.subs_bl_teks = rka.subs_bl_teks;
													_rka.total_harga = rka.rincian;
													_rka.rincian = rka.rincian;
										_rka.rincian_murni = rka.rincian_murni;
										_rka.pajak = rka.pajak;
										_rka.pajak_murni = rka.pajak_murni;
													_rka.totalpajak = rka.totalpajak;
													_rka.updated_user = rka.updated_user;
													_rka.updateddate = rka.updateddate;
													_rka.updatedtime = rka.updatedtime;
													_rka.user1 = rka.user1;
													_rka.user2 = rka.user2;
													_rka.id_prop_penerima = 0;
													_rka.id_camat_penerima = 0;
													_rka.id_kokab_penerima = 0;
													_rka.id_lurah_penerima = 0;
													_rka.id_penerima = 0;
													_rka.idkomponen = 0;
													_rka.idketerangan = 0;
													_rka.idsubtitle = 0;
													_data.push(_rka);
													//if((i+1)%_leng == 0){
													//	_data_all.push(_data);
													//	_data = [];
													//}
												});
												if(_data.length > 0){
													_data_all.push(_data);
												}
												var no_excel = 0;
												var no_page = 0;
												var last = _data_all.length-1;
												_data_all.reduce(function(sequence, nextData){
													return sequence.then(function(current_data){
														return new Promise(function(resolve_reduce, reject_reduce){
															// console.log('current_data', current_data);
															var sendData = current_data.map(function(rka, i){
																if(!rka.id_rinci_sub_bl){
																	return Promise.resolve();
																}else{
																	return getDetailRin(id_unit, kode_sbl, rka.id_rinci_sub_bl, 0).then(function(detail_rin){
																		data_rka.rka[i] = rka;
																		data_rka.rka[i].id_prop_penerima = detail_rin.id_prop_penerima;
																		data_rka.rka[i].id_camat_penerima = detail_rin.id_camat_penerima;
																		data_rka.rka[i].id_kokab_penerima = detail_rin.id_kokab_penerima;
																		data_rka.rka[i].id_lurah_penerima = detail_rin.id_lurah_penerima;
																		data_rka.rka[i].id_penerima = detail_rin.id_penerima;
																		data_rka.rka[i].idkomponen = detail_rin.idkomponen;
																		data_rka.rka[i].idketerangan = detail_rin.idketerangan;
																		data_rka.rka[i].idsubtitle = detail_rin.idsubtitle;
																		if(!opsi){
																			no_excel++;
																			var tbody_excel = ''
																				+'<tr>'
																		+'<td style="mso-number-format:\@;">'+no_excel+'</td>'
																		+'<td style="mso-number-format:\@;">'+kode_sbl+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].jenis_bl+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].idsubtitle+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].subs_bl_teks+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].idketerangan+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].ket_bl_teks+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].kode_akun+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].nama_akun+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].nama_komponen+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].spek_komponen+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].koefisien+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].satuan+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].harga_satuan+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].totalpajak+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].rincian+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_rinci_sub_bl+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_penerima+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].lokus_akun_teks+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_prop_penerima+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_camat_penerima+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_kokab_penerima+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_lurah_penerima+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].idkomponen+'</td>'
																				+'</tr>';
																			jQuery('#data_rin_excel').append(tbody_excel);
																			//console.log('data_rka.rka[i]', data_rka.rka[i]);
																		}
																	});
																}
															});
															Promise.all(sendData)
															.then(function(){
																no_page++;
																data_rka.no_page = no_page;
																var data = {
																	message:{
																		type: "get-url",
																		content: {
																			url: config.url_server_lokal,
																			type: 'post',
																			data: data_rka,
																			return: false
																		}
																	}
																};
																if(!opsi || !opsi.no_return){
																	data.message.content.return = true;
																}			
																chrome.runtime.sendMessage(data, function(response) {
																	console.log('Proses wp action singkron_rka:', response);
																	return resolve_reduce(nextData);
																});
															})
															.catch(function(err){
																console.log('err', err);
																return resolve_reduce(nextData);
															});
														})
														.catch(function(e){
															console.log(e);
															return Promise.resolve(nextData);
														});
													})
													.catch(function(e){
														console.log(e);
														return Promise.resolve(nextData);
													});
												}, Promise.resolve(_data_all[last]))
												.then(function(){
													//console.log('Selesai memproses singkron_rka_ke_lokal untuk sub kegiatan:', kode_sbl);
													// if(!opsi || !opsi.no_return){
													// 	sweetAlert('Berhasil Singkron RKA ke DB lokal!');
													// 	jQuery('#wrap-loading').hide();
													// 	jQuery('#download_data_excel').show();
													// }
													if(callback){
														callback();
													}
												});
											}
										})
										.fail(function(){
											console.log('Koneksi error. Coba lagi'+retries); // prrint retry count
											retries > 0 && setTimeout(function(){
												runAjax2(--retries);
											},delay);
										})
									})(20);
								})
							}
						})
						.fail(function(){
							console.log('Koneksi error. Coba lagi'+retries); // prrint retry count
							retries > 0 && setTimeout(function(){
								runAjax1(--retries);
							},delay);
						})
					})(20);
				});
			});
		}else{
			alert('ID Belanja tidak ditemukan!');
			jQuery('#wrap-loading').hide();
		}
	}
}
