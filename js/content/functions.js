function logo_rka(){
	jQuery('#action-sipd').append('<label><input type="radio" id="tampil-logo-rka"> Tampilkan LOGO daerah</label>');
	jQuery('#tampil-logo-rka').on('click', function(){
		if(jQuery('#logo-pemda').length == 0){
			set_logo_rka();
		}
	});
}
function set_logo_rka(){
	var logo = chrome.runtime.getURL("img/logo.png");
	var logo_daerah = '<td rowspan="2" align="center" width="100px" style="padding:10px; border: 1px solid #000; font-weight: bold;"><img id="logo-pemda" src="'+logo+'" width="75px"/></td>';
	jQuery('table[cellpadding="5"]').eq(0).find(' tbody tr').eq(0).prepend(logo_daerah);
}

function ttd_kepala_daerah(target){
	var jabatan = "";
	var daerah = window.location.href.split('.')[0].split('//')[1];
	if(config.nama_daerah){
		daerah = config.nama_daerah;
	}
	if(window.location.href.split('.')[0].indexOf('kab')){
		jabatan = 'Bupati';
		daerah = daerah.replace('kab', '');
	}else if(window.location.href.split('.')[0].indexOf('prov')){
		jabatan = 'Gubernur';
		daerah = daerah.replace('prov', '');
	}else{
		jabatan = 'Walikota';
	}
	if(config.tgl_rka){
		var tgl = get_tanggal();
		var ttd = '<br>'+capitalizeFirstLetter(daerah)+', '+tgl+'<br>'+jabatan+'<br><br><br><br><br>'+config.kepala_daerah;
		var length = 0;

		target.map(function(n, j){
			jQuery(j).find('tr').eq(0).find('td').map(function(i, b){
				var colspan = jQuery(b).attr('colspan');
				if(!colspan){
					colspan = 1;
				}
				length += +colspan;
			});
			jQuery(j).append('<tr><td colspan="'+length+'"><div style="width: 400px; float: right; font-weight: bold; line-height: 1.5; text-align: center">'+ttd+'</div></td></tr>');
			if(n < target.length-1){
				jQuery(j).closest('table').after('<div style="page-break-after:always;"></div>');
			}
		});
		if(config.no_perkada){
			var table_perkada = jQuery('table[cellpadding="0"]').eq(1).find('tbody tr');
			table_perkada.eq(2).find('td').eq(4).text(tgl)
			table_perkada.eq(1).find('td').eq(4).text(config.no_perkada);
			var ket_perkada = prompt("Edit keterangan perkada", table_perkada.eq(0).find('td').eq(2).text());
			table_perkada.eq(0).find('td').eq(2).text(ket_perkada);
		}
	}
	run_download_excel();
}

function get_tanggal(){
	var _default = "";
	if(config.tgl_rka == 'auto'){
		var tgl = new Date();
		var bulan = [
			"Januari", 
			"Februari", 
			"Maret", 
			"April", 
			"Mei", 
			"Juni", 
			"Juli", 
			"Agustus", 
			"September", 
			"Oktober", 
			"November", 
			"Desember"
		];
		_default = tgl.getDate()+' '+bulan[tgl.getMonth()]+' '+tgl.getFullYear();
	}else{
		_default = config.tgl_rka;
	}
	return prompt("Input tanggal tanda tangan", _default);
}

function run_download_excel(){
	var current_url = window.location.href;
	var download_excel = ''
		+'<div id="action-sipd" class="hide-print">'
			+'<a id="excel" onclick="return false;" href="#">DOWNLOAD EXCEL</a>'
		+'</div>';
	// jQuery('td.kiri.kanan.bawah[colspan="13"]').parent().attr('style', 'page-break-inside:avoid; page-break-after:auto');
	jQuery('body').prepend(download_excel);
	jQuery('.cetak > table').attr('id', 'rka');
	// jQuery('html').attr('id', 'rka');

	var style = '';

	style = jQuery('.cetak').attr('style');
	if (typeof style == 'undefined'){ style = ''; };
	jQuery('.cetak').attr('style', style+" font-family:'Open Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; padding:0; margin:0; font-size:13px;");
	
	jQuery('.bawah').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" border-bottom:1px solid #000;");
	});
	
	jQuery('.kiri').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" border-left:1px solid #000;");
	});

	jQuery('.kanan').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" border-right:1px solid #000;");
	});

	jQuery('.atas').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" border-top:1px solid #000;");
	});

	jQuery('.text_tengah').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" text-align: center;");
	});

	jQuery('.text_kiri').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" text-align: left;");
	});

	jQuery('.text_kanan').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" text-align: right;");
	});

	jQuery('.text_block').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" font-weight: bold;");
	});

	jQuery('.text_15').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" font-size: 15px;");
	});

	jQuery('.text_20').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" font-size: 20px;");
	});

	jQuery('td').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+' mso-number-format:\\@;');
	});

	jQuery('#excel').on('click', function(){
		var name = "Laporan";
		if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/kua/41/'+config.id_daerah+'/setunit') != -1){
			name = 'KUA dan PPAS Lampiran 4.1 '+document.querySelectorAll('td[colspan="10"]')[0].innerText;
		}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/kua/42/'+config.id_daerah+'/setunit') != -1){
			name = 'KUA dan PPAS Lampiran 4.2 '+document.querySelectorAll('td[colspan="10"]')[0].innerText;
		}else if(current_url.indexOf('rka-bl-rinci/cetak') != -1){
			name = document.querySelectorAll('.cetak > table table')[1].querySelectorAll('tbody > tr')[7].querySelectorAll('td')[2].innerText;
		}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd') != -1){
			name = jQuery('table[cellpadding="3"]>thead>tr').eq(1).text().trim();
		}
		tableHtmlToExcel('rka', name);
	});
}

function getAllUnit(id_unit){
	return new Promise(function(resolve, reject){
		if(typeof(allUnitSCE) == 'undefined'){
			if(!id_unit){
				id_unit = 0;
			};
			var halumum = config.sipd_url+'daerah/main/budget/skpd/'+config.tahun_anggaran+'/list/'+config.id_daerah+'/'+id_unit;
			jQuery.ajax({
				url: halumum,
				type: 'get',
				success: function(html){
					if(typeof tokek == 'undefined'){
						window.tokek = html.split('tokek="')[1].split('"')[0];
						formData.append('_token', tokek);
					}
					html = html.split('<body class="fix-header hide-sidebar">')[1].split('<script')[0];
					var url_sub_keg = jQuery(html).find("span:contains('Sub Kegiatan Belanja')").closest('a').attr('href');
					jQuery.ajax({
						url: url_sub_keg,
						type: 'get',
						success: function(html){
							var tamu = html.split('tamu="')[1].split('"')[0];
							jQuery.ajax({
								url: tamu,
								type: 'post',
								data: formData,
								processData: false,
			  					contentType: false,
								success: function(unit){
									window.allUnitSCE = unit.data;
									return resolve(unit.data);
								}
							});
						}
					});
				}
			});
		}else{
			return resolve(allUnitSCE);
		}
	});
}

function getAllSubKeg(id_unit){
	return new Promise(function(resolve, reject){
		getAllUnit(id_unit).then(function(unit){
			unit.map(function(b, i){
				if(b.id_skpd == id_unit){
					if(!b.data_sub){
						jQuery.ajax({
							url: config.sipd_url+'daerah/main?'+b.nama_skpd.sParam,
							type: 'get',
							success: function(html){
								var url_sub_keg = html.split('lru8="')[1].split('"')[0];
								jQuery.ajax({
									url: url_sub_keg,
									type: 'post',
									data: formData,
									processData: false,
				  					contentType: false,
									success: function(allsub){
										allUnitSCE[i].data_sub = allsub.data; 
										return resolve(allUnitSCE[i].data_sub);
									}
								});
							}
						});
					}else{
						return resolve(b.data_sub);
					}
				}else{
					console.log('id_skpd '+id_unit+' tidak ditemukan!');
				}
			});
		})
	});
}

function getRincSubKeg(id_unit, kode_sbl){
	return new Promise(function(resolve, reject){
		getAllSubKeg(id_unit).then(function(allsub){
			allsub.map(function(b, i){
				if(b.kode_sbl == kode_sbl){
					if(!b.data_rinc){
						var url_sub_keg = b.action.split("href='main?")[1].split("'")[0];
						jQuery.ajax({
							url: config.sipd_url+'daerah/main?'+url_sub_keg,
							type: 'get',
							success: function(html){
								var kode_get_rinci = html.split('lru1="')[1].split('"')[0];

								if(typeof rincsub == 'undefined'){
									window.rincsub = {};
								}
								rincsub[kode_sbl] = {
									lru1: kode_get_rinci,
									lru3: html.split('lru3="')[1].split('"')[0],
									lru4: html.split('lru4="')[1].split('"')[0],
									lru5: html.split('lru5="')[1].split('"')[0],
									lru6: html.split('lru6="')[1].split('"')[0],
									lru7: html.split('lru7="')[1].split('"')[0],
									lru13: html.split('lru13="')[1].split('"')[0]
								};

								jQuery.ajax({
									url: kode_get_rinci,
									type: 'post',
									data: formData,
									processData: false,
									contentType: false,
									success: function(allrinc){
										allUnitSCE.map(function(un, n){
											if(un.id_skpd == id_unit){
												allUnitSCE[n].data_sub[i].data_rinc = allrinc.data;
												return resolve(allUnitSCE[n].data_sub[i].data_rinc);
											}
										})
									}
								});
							}
						});
					}else{
						return resolve(b.data_rinc);
					}
				}
			});
		})
	});
}

function getDetailPenerima(kode_sbl, rek, nomor_lampiran){
	return new Promise(function(resolve, reject){
		if(typeof(allPenerimaSCE) == 'undefined'){
			if(nomor_lampiran == 5){
				return resolve({});
			}else{
				getToken().then(function(_token){
					var _rek = rek;
					if(!_rek){
						_rek = '7168||lainnya';
					}
					var formDataCustom = new FormData();
					formDataCustom.append('_token', tokek);
					formDataCustom.append('skrim', Curut("rekening="+_rek));
					jQuery.ajax({
						url: rincsub[kode_sbl].lru13,
						type: 'post',
						data: formDataCustom,
						processData: false,
	  					contentType: false,
						success: function(penerima){
							window.allPenerimaSCE = penerima.data;
							return resolve(penerima.data);
						}
					});
				});
			}
		}else{
			return resolve(allPenerimaSCE);
		}
	})
    .catch(function(e){
        console.log(e);
        return Promise.resolve({});
    });
}

function set_null(nomor){
	if(nomor<10){
		nomor = '0'+nomor;
	}
	return nomor;
}

function getKeyCariRinc(kode_get_rka, id_unit, kode_sbl, idbelanjarinci){
	return new Promise(function(resolve, reject){
		if(kode_get_rka){
			resolve(kode_get_rka);
		}else{
			if(typeof resolve_get_url == 'undefined'){
				window.resolve_get_url = {};
			}
			resolve_get_url[idbelanjarinci] = resolve;
			var t = new Date();
			var data_send = { 
				action: 'base64_encrypt',
				api_key: config.api_key,
				data : {
					app : 'budget',
					modul : 'sub_giat_bl',
					sdata : 'rinci_sub_giat',
					sview : 'detil_rinci_sbl',
					stahun : config.tahun_anggaran,
					sdaerah : config.id_daerah,
					sidunit : id_unit,
					kodesbl : kode_sbl,
					idrincisbl : idbelanjarinci,
					stime : t.getFullYear()+'-'+set_null((t.getMonth() + 1))+'-'+set_null(t.getDate())
				}
			};
			var data = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_send,
		    			return: true
					}
			    }
			};
			chrome.runtime.sendMessage(data, function(response) {
			    console.log('responeMessage', response);
			});
		}
	});
}

function getDetailRin(id_unit, kode_sbl, idbelanjarinci, nomor_lampiran, kode_get_rka){
	return new Promise(function(resolve, reject){
		if(!kode_get_rka && !config.sipd_private){
			return resolve(false);
		}
		getKeyCariRinc(kode_get_rka, id_unit, kode_sbl, idbelanjarinci).then(function(kode_get_rka){
			getToken().then(function(_token){
				(function runAjax(retries, delay){
					delay = delay || 30000;
					jQuery.ajax({
						// url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/belanja/'+config.tahun_anggaran+'/rinci/cari-rincian/'+config.id_daerah+'/'+id_unit,
						url: config.sipd_url+'daerah/main?'+kode_get_rka,
						type: 'POST',
						data: formData,
						processData: false,
						contentType: false,
						timeout: 30000,
						success: function(rinci){
							if(nomor_lampiran == 5){
								getProv(id_unit, rincsub[kode_sbl].lru4).then(function(prov){
									if(prov[rinci.id_prop_penerima]){
										rinci.nama_prop = prov[rinci.id_prop_penerima].nama;
										getKab(id_unit, rinci.id_prop_penerima, id_unit, rincsub[kode_sbl].lru5).then(function(kab){
											if(kab[rinci.id_kokab_penerima]){
												rinci.nama_kab = kab[rinci.id_kokab_penerima].nama;
												getKec(id_unit, rinci.id_prop_penerima, rinci.id_kokab_penerima, id_unit, rincsub[kode_sbl].lru6).then(function(kec){
													if(kec[rinci.id_camat_penerima]){
														rinci.nama_kec = kec[rinci.id_camat_penerima].nama;
														getKel(id_unit, rinci.id_prop_penerima, rinci.id_kokab_penerima, rinci.id_camat_penerima, id_unit, rincsub[kode_sbl].lru7).then(function(kel){
															if(kel[rinci.id_lurah_penerima]){
																rinci.nama_kel = kel[rinci.id_lurah_penerima].nama;
																return resolve(rinci);
															}else{
																return resolve(rinci);
															}
														});
													}else{
														return resolve(rinci);
													}
												});
											}else{
												return resolve(rinci);
											}
										});
									}else{
										return resolve(rinci);
									}
								});
							}else{
								return resolve(rinci);
							}
						}
					})
					.fail(function(){
						if (retries > 0 ) {
							console.log('Koneksi error. Coba lagi',retries); // prrint retry count
							setTimeout(function(){
								runAjax(--retries);
							},delay);
						} else {
							console.log('Koneksi error. Gagal mengambil data.');
						}
					})
				})(20);
			});
		});
	});
}

function getKel(id_unit, id_prov, id_kab, id_kec, url){
	return new Promise(function(resolve, reject){
		if(typeof(alamat.kab[id_prov].kec[id_kab].kel[id_kec]) == 'undefined'){
			getToken().then(function(_token){
				var formDataCustom = new FormData();
				formDataCustom.append('_token', tokek);
				formDataCustom.append('skrim', Curut('idprop='+id_prov+'&idkokab='+id_kab+'&idcamat='+id_kec));
				jQuery.ajax({
					// url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/belanja/'+config.tahun_anggaran+'/rinci/tampil-lurah/'+config.id_daerah+'/'+id_unit,
					url: url,
					type: 'post',
					data: formDataCustom,
					processData: false,
  					contentType: false,
					success: function(ret){
						if(!alamat.kab[id_prov].kec[id_kab].kel[id_kec]){
							alamat.kab[id_prov].kec[id_kab].kel[id_kec] = {};
						};
						jQuery('<select>'+ret+'</select>').find('option').map(function(i, b){
							var id_kel = jQuery(b).attr('value');
							var nama = jQuery(b).text();
							if(id_kel != 0){
								alamat.kab[id_prov].kec[id_kab].kel[id_kec][id_kel] = { 
									nama: nama,
									id_kel: id_kel
								};
							}
						});
						return resolve(alamat.kab[id_prov].kec[id_kab].kel[id_kec]);
					}
				});
			});
		}else{
			return resolve(alamat.kab[id_prov].kec[id_kab].kel[id_kec]);
		}
	});
}

function getKec(id_unit, id_prov, id_kab, url){
	return new Promise(function(resolve, reject){
		if(typeof(alamat.kab[id_prov].kec[id_kab]) == 'undefined'){
			var formDataCustom = new FormData();
			formDataCustom.append('_token', tokek);
			formDataCustom.append('skrim', Curut('idprop='+id_prov+'&idkokab='+id_kab));
			getToken().then(function(_token){
				jQuery.ajax({
					// url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/belanja/'+config.tahun_anggaran+'/rinci/tampil-camat/'+config.id_daerah+'/'+id_unit,
					url: url,
					type: 'post',
					data: formDataCustom,
					processData: false,
  					contentType: false,
					success: function(ret){
						if(!alamat.kab[id_prov].kec[id_kab]){
							alamat.kab[id_prov].kec[id_kab] = {
								kel: {}
							};
						};
						jQuery('<select>'+ret+'</select>').find('option').map(function(i, b){
							var id_kec = jQuery(b).attr('value');
							var nama = jQuery(b).text();
							if(id_kec != 0){
								alamat.kab[id_prov].kec[id_kab][id_kec] = { 
									nama: nama,
									id_kec: id_kec
								};
							}
						});
						return resolve(alamat.kab[id_prov].kec[id_kab]);
					}
				});
			});
		}else{
			return resolve(alamat.kab[id_prov].kec[id_kab]);
		}
	});
}

function getKab(id_unit, id_prov, url){
	return new Promise(function(resolve, reject){
		if(typeof(alamat.kab[id_prov]) == 'undefined'){
			var formDataCustom = new FormData();
			formDataCustom.append('_token', tokek);
			formDataCustom.append('skrim', Curut('idprop='+id_prov));
			getToken().then(function(_token){
				jQuery.ajax({
					// url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/belanja/'+config.tahun_anggaran+'/rinci/tampil-kab-kota/'+config.id_daerah+'/'+id_unit,
					url: url,
					type: 'post',
					data: formDataCustom,
					processData: false,
  					contentType: false,
					success: function(ret){
						if(!alamat.kab[id_prov]){
							alamat.kab[id_prov] = {
								kec: {}
							};
						};
						jQuery('<select>'+ret+'</select>').find('option').map(function(i, b){
							var id_kab = jQuery(b).attr('value');
							var nama = jQuery(b).text();
							if(id_kab!=0){
								alamat.kab[id_prov][id_kab] = { 
									nama: nama,
									id_kab: id_kab
								};
							}
						});
						return resolve(alamat.kab[id_prov]);
					}
				});
			});
		}else{
			return resolve(alamat.kab[id_prov]);
		}
	});
}

function getProv(id_unit, url){
	return new Promise(function(resolve, reject){
		if(typeof(alamat) == 'undefined'){
			getToken().then(function(_token){
				jQuery.ajax({
					// url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/belanja/'+config.tahun_anggaran+'/rinci/tampil-provinsi/'+config.id_daerah+'/'+id_unit,
					url: url,
					type: 'post',
					data: FormData,
					processData: false,
  					contentType: false,
					success: function(ret){
						alamat = {
							kab: {}
						};
						jQuery('<select>'+ret+'</select>').find('option').map(function(i, b){
							var val = jQuery(b).attr('value');
							var nama = jQuery(b).text();
							if(val!=0){
								alamat[val] = { 
									nama: nama,
									val: val
								};
							}
						});
						return resolve(alamat);
					}
				});
			});
		}else{
			return resolve(alamat);
		}
	});
}

function getToken(){
	return new Promise(function(resolve, reject){
		if(typeof(tokenSCE) == 'undefined'){
			var token = tokek;
			if(!token){
				jQuery.ajax({
					url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/dashboard/'+config.tahun_anggaran+'/unit/'+config.id_daerah+'/0',
					type: 'get',
					success: function(html){
						html = html.split('tokek="');
						html = html[1].split('"');
						window.tokenSCE = html[0];
						return resolve(tokenSCE);
					}
				});
			}else{
				window.tokenSCE = token;
				return resolve(tokenSCE);
			}
		}else{
			return resolve(tokenSCE);
		}
	})
    .catch(function(e){
        console.log(e);
        return Promise.resolve('');
    });
}

function formatRupiah(angka, prefix){
	if(!angka || angka == '' || angka <= 0){
		angka = '0';
	}
	var number_string = angka.replace(/[^,\d]/g, '').toString(),
	split   		= number_string.split(','),
	sisa     		= split[0].length % 3,
	rupiah     		= split[0].substr(0, sisa),
	ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

	// tambahkan titik jika yang di input sudah menjadi angka ribuan
	if(ribuan){
		separator = sisa ? '.' : '';
		rupiah += separator + ribuan.join('.');
	}

	rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
	return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}

function getNomorLampiran(){
	var current_url = window.location.href;
	return current_url.split('apbd/')[1].split('/')[0];
}

function getMultiAkunByJenisBl(jenis_bls, id_unit, kode_sbl, jenis_akun){
	return new Promise(function(resolve, reject){
		var jenis_bl = jenis_bls.split(',');
		var sendData = jenis_bl.map(function(b, i){
			return new Promise(function(resolve2, reject2){
				getAkunByJenisBl(b, id_unit, kode_sbl).then(function(akun){
					resolve2(akun);
				});
			})
	        .catch(function(e){
	            console.log(e);
	            return Promise.resolve({});
	        });
	    });
	    Promise.all(sendData)
		.then(function(all_akun){
			var ret = {};
			all_akun.map(function(b, i){
				for(var n in b){
					ret[n] = b[n];
				}
			});
			new Promise(function(resolve2, reject2){
				if(!akunBl['all-akun']){
					jQuery.ajax({
						url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/akun/'+config.tahun_anggaran+'/tampil-akun/'+config.id_daerah+'/0',
						type: 'get',
						success: function(ret){
							akunBl['all-akun'] = ret.data;
							return resolve2(akunBl['all-akun']);
						}
					});
				}else{
					return resolve2(akunBl['all-akun']);
				}
			}).then(function(all_akun){
				jenis_akun = jenis_akun.split(',');
				for(var i in all_akun){
					jenis_akun.map(function(d, n){
						if(all_akun[i][d]==1){
							ret[all_akun[i].kode_akun] = {
								nama: all_akun[i].nama_akun,
								kode: all_akun[i].kode_akun,
								val: all_akun[i].id_akun
							}
						}
					});
				}
				return resolve(ret);
			})
		});
	});
}

function getAkunByJenisBl(jenis_bl, id_unit, kode_sbl){
	return new Promise(function(resolve, reject){
		if(typeof(akunBl) == 'undefined' || !akunBl[jenis_bl]){
			getToken().then(function(_token){
				var formDataCustom = new FormData();
				formDataCustom.append('_token', tokek);
				formDataCustom.append('skrim', Curut('komponenkel='+jenis_bl));
				jQuery.ajax({
					url: rincsub[kode_sbl].lru3,
					type: 'post',
					data: formDataCustom,
					processData: false,
  					contentType: false,
					success: function(ret){
						if(typeof(akunBl) == 'undefined'){
							window.akunBl = {};
						}
						var akun = {};
						jQuery('<select>'+ret+'</select>').find('option').map(function(i, b){
							var val = jQuery(b).attr('value');
							var nama = jQuery(b).text();
							var kode = nama.split(' ')[0];
							akun[kode] = { 
								nama: nama,
								kode: kode,
								val: val
							};
						});
						akunBl[jenis_bl] = akun;
						return resolve(akunBl[jenis_bl]);
					}
				});
			});
		}else{
			return resolve(akunBl[jenis_bl]);
		}
	});
}

function singkron_master_cse(val){
	jQuery('#wrap-loading').show();
	console.log('val', val);
	if(val == 'penerima_bantuan'){
		getDetailPenerima('0', false, 0).then(function(_data){
			var data_profile = { 
				action: 'singkron_penerima_bantuan',
				tahun_anggaran: config.tahun_anggaran,
				api_key: config.api_key,
				profile : {}
			};
			_data.map(function(profile, i){
				data_profile.profile[i] = {};
				data_profile.profile[i].alamat_teks = profile.alamat_teks;
				data_profile.profile[i].id_profil = profile.id_profil;
				data_profile.profile[i].jenis_penerima = profile.jenis_penerima;
				data_profile.profile[i].nama_teks = profile.nama_teks;
			});
			var data = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_profile,
		    			return: true
					}
			    }
			};
			chrome.runtime.sendMessage(data, function(response) {
			    console.log('responeMessage', response);
			});
		});
	}else if(val == 'alamat'){
		var id_unit = 0;
		getProv(id_unit, lru4).then(function(prov){
			var data_alamat = { 
				action: 'singkron_alamat',
				tahun_anggaran: config.tahun_anggaran,
				api_key: config.api_key,
				alamat : {}
			};
			var data_prov_map = [];
			for(var i in prov){
				if(i != 'kab'){
					data_alamat.alamat[i] = {};
					data_alamat.alamat[i].nama = prov[i].nama;
					data_alamat.alamat[i].id_alamat = prov[i].val;
					data_alamat.alamat[i].id_prov = '';
					data_alamat.alamat[i].id_kab = '';
					data_alamat.alamat[i].id_kec = '';
					data_alamat.alamat[i].is_prov = 1;
					data_alamat.alamat[i].is_kab = '';
					data_alamat.alamat[i].is_kec = '';
					data_alamat.alamat[i].is_kel = '';
					data_prov_map.push(data_alamat.alamat[i]);
				}
			}
			var data_prov = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_alamat,
		    			return: false
					}
			    }
			};
			chrome.runtime.sendMessage(data_prov, function(response) {
			    console.log(response,'Provinsi');
			// });
				var last = data_prov_map.length-1;
				data_prov_map.reduce(function(sequence, nextData){
					return sequence.then(function(current_data){
						return new Promise(function(resolve_reduce, reject_reduce){
							// console.log('current_data', current_data);
							getKab(id_unit, current_data.id_alamat).then(function(kab){
								var data_alamat_kab = { 
									action: 'singkron_alamat',
									tahun_anggaran: config.tahun_anggaran,
									api_key: config.api_key,
									alamat : {}
								};
								var data_kab_map = [];
								for(var j in kab){
									if(j != 'kec' && j != 0){
										data_alamat_kab.alamat[j] = {};
										data_alamat_kab.alamat[j].nama = kab[j].nama;
										data_alamat_kab.alamat[j].id_alamat = kab[j].id_kab;
										data_alamat_kab.alamat[j].id_prov = current_data.id_alamat;
										data_alamat_kab.alamat[j].id_kab = '';
										data_alamat_kab.alamat[j].id_kec = '';
										data_alamat_kab.alamat[j].is_prov = '';
										data_alamat_kab.alamat[j].is_kab = 1;
										data_alamat_kab.alamat[j].is_kec = '';
										data_alamat_kab.alamat[j].is_kel = '';
										data_kab_map.push(data_alamat_kab.alamat[j]);
									}
								}
								var data_kab = {
									message:{
										type: "get-url",
										content: {
											url: config.url_server_lokal,
											type: 'post',
											data: data_alamat_kab,
											return: false
										}
									}
								};
								chrome.runtime.sendMessage(data_kab, function(response) {
									console.log(response,'Kabupaten untuk Provinsi: '+id_unit+', '+current_data.id_alamat);
								// });
									var last2 = data_kab_map.length-1;
									data_kab_map.reduce(function(sequence2, nextData2){
										return sequence2.then(function(current_data2){
											return new Promise(function(resolve_reduce2, reject_reduce2){
												// console.log('current_data2', current_data2);
												getKec(id_unit, current_data2.id_prov, current_data2.id_alamat).then(function(kec){
													var data_alamat_kec = { 
														action: 'singkron_alamat',
														tahun_anggaran: config.tahun_anggaran,
														api_key: config.api_key,
														alamat : {}
													};
													var data_kec_map = [];
													for(var k in kec){
														if(k != 'kel' && k != 0){
															data_alamat_kec.alamat[k] = {};
															data_alamat_kec.alamat[k].nama = kec[k].nama;
															data_alamat_kec.alamat[k].id_alamat = kec[k].id_kec;
															data_alamat_kec.alamat[k].id_prov = current_data2.id_prov;
															data_alamat_kec.alamat[k].id_kab = current_data2.id_alamat;
															data_alamat_kec.alamat[k].id_kec = '';
															data_alamat_kec.alamat[k].is_prov = '';
															data_alamat_kec.alamat[k].is_kab = '';
															data_alamat_kec.alamat[k].is_kec = 1;
															data_alamat_kec.alamat[k].is_kel = '';
															data_kec_map.push(data_alamat_kec.alamat[k]);
														}
													}
													var data_kec = {
														message:{
															type: "get-url",
															content: {
																url: config.url_server_lokal,
																type: 'post',
																data: data_alamat_kec,
																return: false
															}
														}
													};
													chrome.runtime.sendMessage(data_kec, function(response) {
														console.log(response,'Kecamatan untuk Kabupaten: '+id_unit+', '+current_data2.id_prov+', '+current_data2.id_alamat);
													// });
														var last3 = data_kec_map.length-1;
														data_kec_map.reduce(function(sequence3, nextData3){
															return sequence3.then(function(current_data3){
																return new Promise(function(resolve_reduce3, reject_reduce3){
																	// console.log('current_data3', current_data3);
																	getKel(id_unit, current_data3.id_prov, current_data3.id_kab, current_data3.id_alamat).then(function(kel){
																		var data_alamat_kel = { 
																			action: 'singkron_alamat',
																			tahun_anggaran: config.tahun_anggaran,
																			api_key: config.api_key,
																			alamat : {}
																		};
																		for(var l in kel){
																			if(l != 0){
																				data_alamat_kel.alamat[l] = {};
																				data_alamat_kel.alamat[l].nama = kel[l].nama;
																				data_alamat_kel.alamat[l].id_alamat = kel[l].id_kel;
																				data_alamat_kel.alamat[l].id_prov = current_data3.id_prov;
																				data_alamat_kel.alamat[l].id_kab = current_data3.id_kab;
																				data_alamat_kel.alamat[l].id_kec = current_data3.id_alamat;
																				data_alamat_kel.alamat[l].is_prov = '';
																				data_alamat_kel.alamat[l].is_kab = '';
																				data_alamat_kel.alamat[l].is_kec = '';
																				data_alamat_kel.alamat[l].is_kel = 1;
																			}
																		}
																		var data_kel = {
																			message:{
																				type: "get-url",
																				content: {
																					url: config.url_server_lokal,
																					type: 'post',
																					data: data_alamat_kel,
																					return: false
																				}
																			}
																		};
																		chrome.runtime.sendMessage(data_kel, function(response) {
																			// console.log(response,'Desa/Kelurahan untuk Kecamatan: '+id_unit+', '+current_data3.id_prov+', '+current_data3.id_kab+', '+current_data3.id_alamat);
																		});
																		resolve_reduce3(nextData3);
																	});
																});
															})
															.catch(function(e){
																console.log(e);
																return Promise.resolve(nextData3);
															});
														}, Promise.resolve(data_kec_map[last3]))
														.then(function(data_last){
															return resolve_reduce2(nextData2);
														});
													}); //
												});
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
									}, Promise.resolve(data_kab_map[last2]))
									.then(function(data_last){
										return resolve_reduce(nextData);
									});
								}); //
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
				}, Promise.resolve(data_prov_map[last]))
				.then(function(data_last){
					alert('Berhasil simpan data master Alamat!');
					jQuery('#wrap-loading').hide();
				});
            }); //
		});
	}else{
		jQuery('#wrap-loading').hide();
	}
}

function tampil_alamat_rka(kode_sub, tr_all, callback){
	if(!callback){
		jQuery('#wrap-loading').show();
	}
	var id_unit = window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
	if(!kode_sub){
		kode_sub = jQuery('table[cellpadding="2"]').eq(0).find('tr').eq(5).find('td').eq(2).html().split('&nbsp;')[0];
	}
	jQuery.ajax({
		url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/belanja/'+config.tahun_anggaran+'/giat/tampil-giat/'+config.id_daerah+'/'+id_unit,
		type: 'get',
		success: function(subkeg){
			var kode_sbl = '';
			subkeg.data.map(function(b, i){
				if(b.kode_sub_giat == kode_sub && b.nama_sub_giat.mst_lock != 3){
					kode_sbl = b.nama_sub_giat.kode_sbl;
				}
			});
			if(kode_sbl == ''){
				return alert('kode_sbl tidak ditemukan!');
			}
			getRincSubKeg(id_unit, kode_sbl).then(function(all_rinc){
				var akun = {
					kode: '',
					nama: '',
					data: {}
				};
				var kelompok = '';
				var keterangan = '';
				var all_data = [];
				jQuery('table[cellpadding="5"]').eq(4).find('>tbody>tr').map(function(i, b){
					if(tr_all && !tr_all[i]){
						return;
					}else{
						var td = jQuery(b).find('td');
						if(td.length == 3){
							var kode = td.eq(0).text().trim();
							var nama = td.eq(1).text().trim();
							if(kode && kode.split('.').length==6){
								akun.kode = kode; 
								akun.nama = nama;
							}else if(kode == ''){
								if(nama.indexOf('[#]') != -1){
									kelompok = nama;
									akun.data[kelompok] = {};	
								}else if(nama.indexOf('[-]') != -1){
									keterangan = nama;
									akun.data[kelompok][keterangan] = [];
								}
							}
						}else if(td.length == 7){
							var item = {
								nama : td.eq(1).find('div').eq(0).text().trim(),
								spek : td.eq(1).find('div').eq(1).text().trim(),
								koef : td.eq(2).text().trim(),
								jumlah : +(td.eq(6).text().trim().replace(/\./g,'').replace('Rp ','')),
								tr_id : i,
								kode_akun : akun.kode,
								nama_akun : akun.nama,
								kelompok : kelompok,
								keterangan : keterangan
							};
							all_data.push(item);
							akun.data[kelompok][keterangan].push(item);
						}
					}
				});
				// console.log('all_data', all_data);

				var last = all_data.length-1;
				all_data.reduce(function(sequence, nextData){
			        return sequence.then(function(current_data){
			    		return new Promise(function(resolve_reduce, reject_reduce){
			    			var idbelanjarinci = '';
			    			var nama_sh = [];
			    			all_rinc.map(function(b, i){
			    				if(
			    					b.kode_akun == current_data.kode_akun
			    					&& b.subs_bl_teks.trim() == current_data.kelompok
			    					&& b.ket_bl_teks.trim() == current_data.keterangan
			    					&& b.nama_standar_harga.nama_komponen.trim() == current_data.nama
			    					&& b.koefisien == current_data.koef
			    					&& b.rincian == current_data.jumlah
			    				){
			    					idbelanjarinci = b.id_rinci_sub_bl;
			    					var nama = '';
			    					if(b.nama_standar_harga.nama_komponen){
			    						nama = b.nama_standar_harga.nama_komponen;
			    					}
			    					var spek = '';
			    					if(b.nama_standar_harga.spek_komponen){
			    						spek = b.nama_standar_harga.spek_komponen;
			    					}
			    					nama_sh = ''
			    						+'<div>'+nama+'</div>'
			    						+'<div style="margin-left: 20px">'+spek+'</div>';
			    					current_data.lokus_akun_teks = b.lokus_akun_teks;
			    				}
			    			});
			    			if(idbelanjarinci != ''){
				    			getDetailPenerima(kode_sbl).then(function(all_penerima){
					    			getDetailRin(id_unit, kode_sbl, idbelanjarinci, 5).then(function(rinci_penerima){
					    				if(rinci_penerima.id_penerima && rinci_penerima.id_penerima != 0){
					    					var cek =  false;
						    				all_penerima.map(function(p, o){
												if(p.id_profil == rinci_penerima.id_penerima){
													cek = true;
													nama_sh += ''
								    					+'<div style="margin-left: 40px">'
								    						+current_data.lokus_akun_teks+' ('+p.alamat_teks+' - '+p.jenis_penerima+')'
						    							+'</div>';
												}
											});
											if(!cek){
			    								console.log('current_data skip (bukan penerima bantuan)', current_data, rinci_penerima);
											}
						    			}else if(rinci_penerima.nama_prop){
						    				nama_sh += ''
						    					+'<div style="margin-left: 40px">'
						    						+'Provinsi '+rinci_penerima.nama_prop
													+', '+rinci_penerima.nama_kab
													+', Kecamatan '+rinci_penerima.nama_kec
													+', '+rinci_penerima.nama_kel;
						    					+'</div>';
						    			}else if(current_data.lokus_akun_teks){
						    				nama_sh += ''
						    					+'<div style="margin-left: 40px">'
						    						+current_data.lokus_akun_teks
				    							+'</div>';
						    			}else{
			    							console.log('current_data skip (bukan penerima bantuan)', current_data);
						    			}
					    				jQuery('table[cellpadding="5"]').eq(4).find('>tbody>tr').eq(current_data.tr_id).find('td').eq(1).html(nama_sh);
					    				resolve_reduce(nextData);
					    			});
					    		});
				    		}else{
			    				console.log('current_data skip (idbelanjarinci tidak ditemukan)', current_data);
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
			    }, Promise.resolve(all_data[last]))
			    .then(function(data_last){
			    	if(callback){
			    		callback();
			    	}else{
			    		jQuery('#wrap-loading').hide();
			    	}
			    })
			    .catch(function(e){
			        console.log(e);
			    	if(callback){
			    		callback();
			    	}else{
			    		jQuery('#wrap-loading').hide();
			    	}
			    });
			});
		}
	});
}

function hapusKomponen(kodesbl,idblrinci){
	var id_unit = window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
    jQuery.ajax({
      	url: '../../hapus-rincian/'+config.id_daerah+'/'+id_unit,
      	type: "POST",
      	data:{
      		"_token": tokek,
      		"skrim":CR64('kodesbl='+kodesbl+'&idbelanjarinci='+idblrinci+'&jeniskk=0')
      	},
      	success: function(data){
          	jQuery.ajax({
	            url: "../../refresh-belanja/"+config.id_daerah+"/"+id_unit,
	            type: "post",
	            data:{"_token":tokek,"kodesbl":kodesbl},
	            success: function(hasil){
	              	var res=hasil.split("||");
	              	var pagu, rinci;
	              	if(res[0]==0){ pagu=0; } else if(res[0]!=0){ pagu = jQuery.number(res[0],0,',','.'); }
	              	if(res[1]==0){ rinci=0; } else if(res[1]!=0){ rinci = jQuery.number(res[1],0,',','.'); }
	              	jQuery(".statustotalpagu").html(pagu);
	              	jQuery(".statustotalrincian").html(rinci);
	            }
          	});
          	if(thpStatus=="murni"){
            	jQuery('#table_rinci').DataTable().ajax.reload();
          	}else if(thpStatus=="perubahan" || thpStatus=="pergeseran"){
            	jQuery('#table_rinci_perubahan').DataTable().ajax.reload();
          	}
      }
    });
}

function singkron_user_deskel_lokal(){
	jQuery.ajax({
      	url: config.sipd_url+'daerah/main/plan/setup-user/'+config.tahun_anggaran+'/kel-desa/tampil/'+config.id_daerah+'/0',
      	type: "GET",
      	success: function(desa){
      		var last = desa.data.length-1;
      		desa.data.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			var data_deskel = { 
							action: 'singkron_user_deskel',
							tahun_anggaran: config.tahun_anggaran,
							api_key: config.api_key,
							data: {}
						};
        				data_deskel.data = current_data;
            				jQuery.ajax({
						      	url: config.sipd_url+'daerah/main/plan/setup-user/'+config.tahun_anggaran+'/kel-desa/detil/'+config.id_daerah+'/0',
						      	type: "POST",
	            				data:{"_token":tokek,"idxuser":current_data.id_user},
						      	success: function(detil){
									jQuery.extend(data_deskel.data, detil);
									delete(data_deskel.data.action);
									delete(data_deskel.data.set_pengusul);
									delete(data_deskel.data.status);
									var data = {
									    message:{
									        type: "get-url",
									        content: {
											    url: config.url_server_lokal,
											    type: 'post',
											    data: data_deskel,
								    			return: false
											}
									    }
									};
									chrome.runtime.sendMessage(data, function(response) {
									    console.log('responeMessage', response);
							    		resolve_reduce(nextData);
									});
						      	}
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
            }, Promise.resolve(desa.data[last]))
            .then(function(data_last){
            	sweetAlert('Berhasil singkron data User Pengusul Kelurahan/Desa!');
            	jQuery('#wrap-loading').hide();
            });
      	}
    });
}

function singkron_user_dewan_lokal(){
	jQuery.ajax({
      	url: config.sipd_url+'daerah/main/plan/setup-user/'+config.tahun_anggaran+'/anggota-dewan/tampil/'+config.id_daerah+'/0',
      	type: "GET",
      	success: function(dewan){
      		var last = dewan.data.length-1;
      		dewan.data.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			jQuery.ajax({
					      	url: config.sipd_url+'daerah/main/plan/setup-user/'+config.tahun_anggaran+'/anggota-dewan/detil/'+config.id_daerah+'/0',
					      	type: "POST",
            				data:{"_token":tokek,"idxuser":current_data.id_user},
					      	success: function(detil){
		            			var data_dewan = { 
									action: 'singkron_user_dewan',
									tahun_anggaran: config.tahun_anggaran,
									api_key: config.api_key,
									data: {}
								};
								data_dewan.data = detil;
					      		var data = {
								    message:{
								        type: "get-url",
								        content: {
										    url: config.url_server_lokal,
										    type: 'post',
										    data: data_dewan,
							    			return: false
										}
								    }
								};
								chrome.runtime.sendMessage(data, function(response) {
								    console.log('responeMessage', response);
						    		resolve_reduce(nextData);
								});
					      	}
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
            }, Promise.resolve(dewan.data[last]))
            .then(function(data_last){
            	sweetAlert('Berhasil singkron data User Anggota Dewan!');
            	jQuery('#wrap-loading').hide();
            });
      	}
    });

}

function detil_analisis_belanja(){
	var data_link_akun = [];
	jQuery('#table_standar_harga tbody tr').map(function(i, b){
		var td = jQuery(b).find('td');
		if(td.eq(6).find('.detil_akun').length <= 0){
			var link = td.eq(6).html().split('href="')[1].split('"')[0];
			var no = +td.eq(0).text();
			data_link_akun.push({
				url: link,
				tr: i,
				no: no-1
			});
		}
	});
	var last = data_link_akun.length-1;
	data_link_akun.reduce(function(sequence, nextData){
        return sequence.then(function(current_data){
    		return new Promise(function(resolve_reduce, reject_reduce){
				jQuery.ajax({
			      	url: current_data.url,
			      	type: "GET",
			      	success: function(html){
			      		var link = html.split("budget/analisis/"+config.tahun_anggaran+"/bl/tampil-akun/"+config.id_daerah+"/0")[1].split("'");
			      		jQuery.ajax({
					      	url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/analisis/'+config.tahun_anggaran+'/bl/tampil-akun/'+config.id_daerah+'/0'+link,
					      	type: "GET",
					      	success: function(akun){
					      		var rek = [];
					      		akun.data.map(function(b, i){
					      			rek.push(b.kode_akun+' '+b.nama_akun);
					      		});
					      		var ket = ', <br><span class="detil_akun">'+rek.join(', <br>')+'</span>';
					      		jQuery('#table_standar_harga tbody tr').eq(current_data.tr).find('td').eq(6).append(ket);
					      		run_script("jQuery('#table_standar_harga').DataTable().rows().data()["+current_data.no+"].totalakun.nilai += '"+ket+"';");
					      		resolve_reduce(nextData);
					      	}
					    });
			      	}
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
    }, Promise.resolve(data_link_akun[last]))
    .then(function(data_last){
    	run_script("jQuery('#table_standar_harga').DataTable().row().invalidate();");
    	run_script("jQuery('#table_standar_harga').DataTable().draw();");
    	jQuery('#wrap-loading').hide();
    });
}

function singkron_pengaturan_sipd_lokal(){
	var data = {
	    message:{
	        type: "get-url",
	        content: {
                url: config.url_server_lokal,
                type: 'post',
                data: { 
                    action: 'singkron_pengaturan_sipd',
                    tahun_anggaran: config.tahun_anggaran,
                    api_key: config.api_key,
                    data: {
                            daerah: jQuery('h4.text-white.font-bold').text(),
                            kepala_daerah: jQuery('input[name="kepala_daerah"]').val(),
                            wakil_kepala_daerah: jQuery('input[name="wakil_kepala_daerah"]').val(),
                            awal_rpjmd: jQuery('input[name="awal_rpjmd"]').val(),
                            akhir_rpjmd: jQuery('input[name="akhir_rpjmd"]').val(),
                            pelaksana_rkpd: jQuery('input[name="pelaksana_rkpd"]').val(),
                            pelaksana_kua: jQuery('input[name="pelaksana_kua"]').val(),
                            pelaksana_apbd: jQuery('input[name="pelaksana_apbd"]').val(),
                            set_kpa_sekda: jQuery('input[name="set_kpa_sekda"]').val(),
                    }
                },
            	return: true
            }
	    }
	};
	chrome.runtime.sendMessage(data, function(response) {
	    console.log('responeMessage', response);
	});
}

function singkron_renstra_lokal(){
	jQuery('#wrap-loading').show();
	var id_unit = window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
	jQuery.ajax({
      	url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/renstra/'+config.tahun_anggaran+'/tampil-renstra/'+config.id_daerah+'/'+id_unit+'?filter_program=&filter_indi_prog=&filter_giat=&filter_skpd=',
      	type: "GET",
      	contentType: 'application/json',
      	success: function(rens){
      		var data_renstra = [];
      		rens.data.map(function(b, i){
      			data_renstra[i] = {};
      			data_renstra[i].id_bidang_urusan = b.id_bidang_urusan;
				data_renstra[i].id_giat = b.id_giat;
				data_renstra[i].id_program = b.id_program;
				data_renstra[i].id_renstra = b.id_renstra;
				data_renstra[i].id_rpjmd = b.id_rpjmd;
				data_renstra[i].id_sub_giat = b.id_sub_giat;
				data_renstra[i].id_unit = b.id_unit;
				data_renstra[i].indikator = b.indikator;
				data_renstra[i].indikator_sub = b.indikator_sub;
				data_renstra[i].is_locked = b.is_locked;
				data_renstra[i].kebijakan_teks = b.kebijakan_teks;
				data_renstra[i].kode_bidang_urusan = b.kode_bidang_urusan;
				data_renstra[i].kode_giat = b.kode_giat;
				data_renstra[i].kode_program = b.kode_program;
				data_renstra[i].kode_skpd = b.kode_skpd;
				data_renstra[i].kode_sub_giat = b.kode_sub_giat;
				data_renstra[i].misi_teks = b.misi_teks;
				data_renstra[i].nama_bidang_urusan = b.nama_bidang_urusan;
				data_renstra[i].nama_giat = b.nama_giat;
				data_renstra[i].nama_program = b.nama_program;
				data_renstra[i].nama_skpd = b.nama_skpd;
				data_renstra[i].nama_sub_giat = b.nama_sub_giat;
				data_renstra[i].outcome = b.outcome;
				data_renstra[i].pagu_1 = b.pagu_1;
				data_renstra[i].pagu_2 = b.pagu_2;
				data_renstra[i].pagu_3 = b.pagu_3;
				data_renstra[i].pagu_4 = b.pagu_4;
				data_renstra[i].pagu_5 = b.pagu_5;
				data_renstra[i].pagu_sub_1 = b.pagu_sub_1;
				data_renstra[i].pagu_sub_2 = b.pagu_sub_2;
				data_renstra[i].pagu_sub_3 = b.pagu_sub_3;
				data_renstra[i].pagu_sub_4 = b.pagu_sub_4;
				data_renstra[i].pagu_sub_5 = b.pagu_sub_5;
				data_renstra[i].sasaran_teks = b.sasaran_teks;
				data_renstra[i].satuan = b.satuan;
				data_renstra[i].satuan_sub = b.satuan_sub;
				data_renstra[i].strategi_teks = b.strategi_teks;
				data_renstra[i].target_1 = b.target_1;
				data_renstra[i].target_2 = b.target_2;
				data_renstra[i].target_3 = b.target_3;
				data_renstra[i].target_4 = b.target_4;
				data_renstra[i].target_5 = b.target_5;
				data_renstra[i].target_sub_1 = b.target_sub_1;
				data_renstra[i].target_sub_2 = b.target_sub_2;
				data_renstra[i].target_sub_3 = b.target_sub_3;
				data_renstra[i].target_sub_4 = b.target_sub_4;
				data_renstra[i].target_sub_5 = b.target_sub_5;
				data_renstra[i].tujuan_teks = b.tujuan_teks;
				data_renstra[i].visi_teks = b.visi_teks;
			});
			var data = {
			    message:{
			        type: "get-url",
			        content: {
		                url: config.url_server_lokal,
		                type: 'post',
		                data: { 
		                    action: 'singkron_renstra',
		                    tahun_anggaran: config.tahun_anggaran,
		                    api_key: config.api_key,
		                    data: data_renstra
		                },
		            	return: true
		            }
			    }
			};
			chrome.runtime.sendMessage(data, function(response) {
			    console.log('responeMessage', response);
			});
      	}
    });
}
function singkron_pendapatan_lokal_all_unit(){
	(function runAjax(retries, delay){
		delay = delay || 30000;
		jQuery.ajax({
			url: config.sipd_url+'daerah/main/budget/pendapatan/'+config.tahun_anggaran+'/ang/tampil-unit/'+config.id_daerah+'/0',
			type: 'get',
			timeout: 30000,
			success: function(unit){
				jQuery('#persen-loading').attr('total', unit.data.length);
				jQuery('#persen-loading').attr('progress', 0);
				unit.data.map(function(d,i){
					singkron_pendapatan_lokal(d.id_skpd,false)
				})
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

function singkron_asmas_lokal(){
	jQuery('#wrap-loading').show();
	jQuery.ajax({
      	url: lru6,
      	type: "POST",
		data: formData,
		processData: false,
		contentType: false,
      	success: function(data){
      		var last = data.data.length-1;
      		data.data.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			var data_asmas = {};
		      			data_asmas.alamat_teks = current_data.alamat_teks;
						data_asmas.anggaran = current_data.anggaran;
						data_asmas.batal_teks = current_data.batal_teks;
						data_asmas.bidang_urusan = current_data.bidang_urusan;
						data_asmas.created_date = current_data.created_date;
						data_asmas.created_user = current_data.created_user;
						data_asmas.file_foto = current_data.file_foto;
						data_asmas.file_pengantar = current_data.file_pengantar;
						data_asmas.file_proposal = current_data.file_proposal;
						data_asmas.file_rab = current_data.file_rab;
						data_asmas.giat_teks = current_data.giat_teks;
						data_asmas.id_bidang_urusan = current_data.id_bidang_urusan;
						data_asmas.id_daerah = current_data.id_daerah;
						data_asmas.id_jenis_profil = current_data.id_jenis_profil;
						data_asmas.id_jenis_usul = current_data.id_jenis_usul;
						data_asmas.id_kab_kota = current_data.id_kab_kota;
						data_asmas.id_kecamatan = current_data.id_kecamatan;
						data_asmas.id_kelurahan = current_data.id_kelurahan;
						data_asmas.id_pengusul = current_data.id_pengusul;
						data_asmas.id_profil = current_data.id_profil;
						data_asmas.id_unit = current_data.id_unit;
						data_asmas.id_usulan = current_data.id_usulan;
						data_asmas.is_batal = current_data.is_batal;
						data_asmas.is_tolak = current_data.is_tolak;
						data_asmas.jenis_belanja = current_data.jenis_belanja;
						data_asmas.jenis_profil = current_data.jenis_profil;
						data_asmas.jenis_usul_teks = current_data.jenis_usul_teks;
						data_asmas.kelompok = current_data.kelompok;
						data_asmas.kode_skpd = current_data.kode_skpd;
						data_asmas.koefisien = current_data.koefisien;
						data_asmas.level_pengusul = current_data.level_pengusul;
						data_asmas.lokus_usulan = current_data.lokus_usulan;
						data_asmas.masalah = current_data.masalah;
						data_asmas.nama_daerah = current_data.nama_daerah;
						data_asmas.nama_skpd = current_data.nama_skpd;
						data_asmas.nama_user = current_data.nama_user;
						data_asmas.nip = current_data.nip;
						data_asmas.pengusul = current_data.pengusul;
						data_asmas.rekom_camat_anggaran = current_data.anggaran;
						data_asmas.rekom_camat_koefisien = current_data.koefisien;
						data_asmas.rekom_camat_rekomendasi = current_data.rekomendasi;
						data_asmas.rekom_lurah_anggaran = current_data.anggaran;
						data_asmas.rekom_lurah_koefisien = current_data.koefisien;
						data_asmas.rekom_lurah_rekomendasi = current_data.rekomendasi;
						data_asmas.rekom_mitra_anggaran = current_data.anggaran;
						data_asmas.rekom_mitra_koefisien = current_data.koefisien;
						data_asmas.rekom_mitra_rekomendasi = current_data.rekomendasi;
						data_asmas.rekom_skpd_anggaran = current_data.anggaran;
						data_asmas.rekom_skpd_koefisien = current_data.koefisien;
						data_asmas.rekom_skpd_rekomendasi = current_data.rekomendasi;
						data_asmas.rekom_tapd_anggaran = current_data.anggaran;
						data_asmas.rekom_tapd_koefisien = current_data.koefisien;
						data_asmas.rekom_tapd_rekomendasi = current_data.rekomendasi;
						data_asmas.rev_skpd = current_data.rev_skpd;
						data_asmas.satuan = current_data.satuan;
						data_asmas.status_usul = current_data.status_usul;
						data_asmas.status_usul_teks = current_data.status_usul_teks;
						data_asmas.tolak_teks = current_data.tolak_teks;
						data_asmas.tujuan_usul = current_data.tujuan_usul;

						var idusulan = current_data.action.split("detilUsulan('")[1].split("'")[0];
            			get_detail_asmas(idusulan).then(function(detail){
							data_asmas.detail_alamatteks = detail.alamatteks;
							data_asmas.detail_anggaran = detail.anggaran;
							data_asmas.detail_bidangurusan = detail.bidangurusan;
							data_asmas.detail_camatteks = detail.camatteks;
							data_asmas.detail_filefoto = detail.filefoto;
							data_asmas.detail_filefoto2 = detail.filefoto2;
							data_asmas.detail_filefoto3 = detail.filefoto3;
							data_asmas.detail_filepengantar = detail.filepengantar;
							data_asmas.detail_fileproposal = detail.fileproposal;
							data_asmas.detail_filerab = detail.filerab;
							data_asmas.detail_gagasan = detail.gagasan;
							data_asmas.detail_idcamat = detail.idcamat;
							data_asmas.detail_idkabkota = detail.idkabkota;
							data_asmas.detail_idkamus = detail.idkamus;
							data_asmas.detail_idlurah = detail.idlurah;
							data_asmas.detail_idskpd = detail.idskpd;
							data_asmas.detail_jenisbelanja = detail.jenisbelanja;
							data_asmas.detail_kodeskpd = detail.kodeskpd;
							data_asmas.detail_langpeta = detail.langpeta;
							data_asmas.detail_latpeta = detail.latpeta;
							data_asmas.detail_lurahteks = detail.lurahteks;
							data_asmas.detail_masalah = detail.masalah;
							data_asmas.detail_namakabkota = detail.namakabkota;
							data_asmas.detail_namaskpd = detail.namaskpd;
							data_asmas.detail_rekomteks = detail.rekomteks;
							data_asmas.detail_satuan = detail.satuan;
							data_asmas.detail_setStatusUsul = detail.setStatusUsul;
							data_asmas.detail_subgiat = detail.subgiat;
							data_asmas.detail_tujuanusul = detail.tujuanusul;
							data_asmas.detail_usulanggaran = detail.usulanggaran;
							data_asmas.detail_usulvolume = detail.usulvolume;
							data_asmas.detail_volume = detail.volume;

							var data = {
							    message:{
							        type: "get-url",
							        content: {
						                url: config.url_server_lokal,
						                type: 'post',
						                data: { 
						                    action: 'singkron_asmas',
						                    tahun_anggaran: config.tahun_anggaran,
						                    api_key: config.api_key,
						                    data: data_asmas
						                },
						            	return: true
						            }
							    }
							};
							chrome.runtime.sendMessage(data, function(response) {
							    console.log('responeMessage', response);
							});
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
            }, Promise.resolve(data.data[last]))
            .then(function(data_last){
            	jQuery('#wrap-loading').hide();
            })
            .catch(function(e){
                console.log(e);
            });
      	}
    });
}

function get_detail_asmas(idusulan){
    return new Promise(function(resolve, reject){
		jQuery.ajax({
	      	url: endog+'?'+idusulan,
	      	type: "POST",
			data: formData,
			processData: false,
			contentType: false,
	      	success: function(data){
	      		return resolve(data);
	      	}
	    });
    });
}

function singkron_pendapatan_lokal(id_unit,rtn=true){
	jQuery('#wrap-loading').show();
	// var id_unit = idune;
	jQuery.ajax({
      	url: lru2,
      	type: "POST",
		data: formData,
		processData: false,
		contentType: false,
      	success: function(data){
      		var data_pendapatan = [];
      		data.data.map(function(b, i){
      			data_pendapatan[i] = {};
      			data_pendapatan[i].created_user = b.created_user;
				data_pendapatan[i].createddate = b.createddate;
				data_pendapatan[i].createdtime = b.createdtime;
				data_pendapatan[i].id_pendapatan = b.id_pendapatan;
				data_pendapatan[i].keterangan = b.keterangan;
				data_pendapatan[i].kode_akun = b.kode_akun;
				data_pendapatan[i].nama_akun = b.nama_akun;
				data_pendapatan[i].nilaimurni = b.nilaimurni;
				data_pendapatan[i].program_koordinator = b.program_koordinator;
				data_pendapatan[i].rekening = b.rekening;
				data_pendapatan[i].skpd_koordinator = b.skpd_koordinator;
				data_pendapatan[i].total = b.total;
				data_pendapatan[i].updated_user = b.updated_user;
				data_pendapatan[i].updateddate = b.updateddate;
				data_pendapatan[i].updatedtime = b.updatedtime;
				data_pendapatan[i].uraian = b.uraian;
				data_pendapatan[i].urusan_koordinator = b.urusan_koordinator;
				data_pendapatan[i].user1 = b.user1;
				data_pendapatan[i].user2 = b.user2;
			});
			var data = {
			    message:{
			        type: "get-url",
			        content: {
		                url: config.url_server_lokal,
		                type: 'post',
		                data: { 
		                    action: 'singkron_pendapatan',
		                    tahun_anggaran: config.tahun_anggaran,
		                    api_key: config.api_key,
		                    data: data_pendapatan,
		                    id_skpd: id_unit
		                },
		            	return: rtn
		            }
			    }
			};
			chrome.runtime.sendMessage(data, function(response) {
			    console.log('responeMessage', response);
				var c_total = +jQuery('#persen-loading').attr('total');
				var c_progress = +jQuery('#persen-loading').attr('progress')+1;
				jQuery('#persen-loading').attr('total', c_total);
				jQuery('#persen-loading').attr('progress', c_progress);
				jQuery('#persen-loading').html((((c_progress)/c_total)*100).toFixed(2)+'%'+'<br>');
				if (c_progress == c_total & !rtn) {
					jQuery('#wrap-loading').hide();
					sweetAlert('Success','Selesai','success');
				}
			});
      	}
    });
}

function singkron_pembiayaan_lokal_all(type){
	(function runAjax(retries, delay){
		delay = delay || 30000;
		jQuery.ajax({
			url: config.sipd_url+'daerah/main/budget/pembiayaan/'+config.tahun_anggaran+'/ang/'+type+'/tampil-unit/'+config.id_daerah+'/0',
			type: 'get',
			timeout: 30000,
			success: function(unit){
				jQuery('#persen-loading').attr('total', unit.data.length);
				jQuery('#persen-loading').attr('progress', 0);
				unit.data.map(function(d,i){
					singkron_pembiayaan_lokal(type,d.id_skpd,false)
				})
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

function singkron_pembiayaan_lokal(type,id_unit,rtn=true){
	jQuery('#wrap-loading').show();
	// var id_unit = idune;
	jQuery.ajax({
      	url: lru2,
      	type: "POST",
		data: formData,
		processData: false,
		contentType: false,
      	success: function(data){
      		var data_pembiayaan = [];
      		data.data.map(function(b, i){
      			data_pembiayaan[i] = {};
      			data_pembiayaan[i].created_user = b.created_user;
				data_pembiayaan[i].createddate = b.createddate;
				data_pembiayaan[i].createdtime = b.createdtime;
				data_pembiayaan[i].id_pembiayaan = b.id_pembiayaan;
				data_pembiayaan[i].keterangan = b.keterangan;
				data_pembiayaan[i].kode_akun = b.kode_akun;
				data_pembiayaan[i].nama_akun = b.nama_akun;
				data_pembiayaan[i].nilaimurni = b.nilaimurni;
				data_pembiayaan[i].program_koordinator = b.program_koordinator;
				data_pembiayaan[i].rekening = b.rekening;
				data_pembiayaan[i].skpd_koordinator = b.skpd_koordinator;
				data_pembiayaan[i].total = b.total;
				data_pembiayaan[i].updated_user = b.updated_user;
				data_pembiayaan[i].updateddate = b.updateddate;
				data_pembiayaan[i].updatedtime = b.updatedtime;
				data_pembiayaan[i].uraian = b.uraian;
				data_pembiayaan[i].urusan_koordinator = b.urusan_koordinator;
				data_pembiayaan[i].type = type;
				data_pembiayaan[i].user1 = b.user1;
				data_pembiayaan[i].user2 = b.user2;
			});
			var data = {
			    message:{
			        type: "get-url",
			        content: {
		                url: config.url_server_lokal,
		                type: 'post',
		                data: { 
		                    action: 'singkron_pembiayaan',
		                    tahun_anggaran: config.tahun_anggaran,
		                    api_key: config.api_key,
		                    data: data_pembiayaan,
		                    id_skpd: id_unit
		                },
		            	return: rtn
		            }
			    }
			};
			chrome.runtime.sendMessage(data, function(response) {
			    console.log('responeMessage', response);
				var c_total = +jQuery('#persen-loading').attr('total');
				var c_progress = +jQuery('#persen-loading').attr('progress')+1;
				jQuery('#persen-loading').attr('total', c_total);
				jQuery('#persen-loading').attr('progress', c_progress);
				jQuery('#persen-loading').html((((c_progress)/c_total)*100).toFixed(2)+'%'+'<br>');
				if (c_progress == c_total & !rtn) {
					jQuery('#wrap-loading').hide();
					sweetAlert('Success','Selesai','success');
				}

			});
      	}
    });
}

function get_type_jadwal(){
	if(jQuery('button[onclick="setFase()"]').text().indexOf('Perencanaan') == -1){
		return 'budget';
	}else{
		return 'plan';
	}

}

function get_kd_sbl(){
	var kode_sbl = false;
	jQuery('script').map(function(i, b){
		var script = jQuery(b).html();
		script = script.split('?kodesbl=');
		if(script.length > 1){
			script = script[1].split("'");
			kode_sbl = script[0];
		}
	});
	return kode_sbl;
}

function get_kd_bl(){
	var kode_sbl = get_kd_sbl();
	var _kode_bl = kode_sbl.split('.');
	_kode_bl.pop();
	kode_bl = _kode_bl.join('.');
	return kode_bl;
}

function setLampiran(cetak, model, jenis){
	jQuery('a.set-lampiran').remove();
	if(
		jQuery('a.apbd-penjabaran-lampiran-1').length == 0
		&& cetak == 'apbd'
		&& model == 'perkada'
		&& (
			jenis == '1'
			|| jenis == '2'
		)
	){
		jQuery('#wrap-loading').show();
		var data = {
		    message:{
		        type: "get-url",
		        content: {
	                url: config.url_server_lokal,
	                type: 'post',
	                data: { 
	                    action: 'get_link_laporan',
	                    tahun_anggaran: config.tahun_anggaran,
	                    api_key: config.api_key,
	                    jenis: jenis,
	                    model: model,
	                    cetak: cetak
	                },
	            	return: true
	            }
		    }
		};
		chrome.runtime.sendMessage(data, function(response) {
		    console.log('responeMessage', response);
		});
	}
}

function log(){
	var arg = [];
	for(var i=0, l=arguments.length; i<l; i++){
		console.info(arguments[i]);
	}
}

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function(e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/%([0-9A-F]{2})/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function(e) {
        e = e.replace(/\r\n/g, "n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function(e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}

function Curut(text) {
    return (Base64.encode(text));
}

function Dengkul(text) {
    return (Base64.decode(text));
}

function go_halaman_detail_rincian(options){
	return new Promise(function(resolve, reject){
		if(!options.go_rinci){
			return resolve(options.kode);
		}else{
			jQuery.ajax({
				url: options.kode,
				success: function(html){
					var kode_get_rinci = html.split('lru1="')[1].split('"')[0];
					return resolve(kode_get_rinci);
				}
			});
		}
	})
	.catch(function(e){
        console.log(e);
        return Promise.resolve();
    });
}

function get_detail_skpd(id_unit){
	return new Promise(function(resolve, reject){
		if(typeof detail_skpd == 'undefined'){
			jQuery.ajax({
				url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/skpd/'+config.tahun_anggaran+'/detil-skpd/'+config.id_daerah+'/'+id_unit,
				type: 'post',
				data: "_token="+tokek+'&idskpd='+id_unit,
				success: function(data){
					window.detail_skpd = data;
					return resolve(data);
				}
			});
		}else{
			return resolve(detail_skpd);
		}
	});
}

function get_kode_from_rincian_page(opsi, kode_sbl){
	return new Promise(function(resolve, reject){
		if(!opsi || !opsi.kode_bl){
			var url_sub_keg = jQuery('.white-box .p-b-20 .btn-circle').attr('href');
			jQuery.ajax({
				url: url_sub_keg,
				success: function(html){
					var url_list_sub = html.split('lru8="')[1].split('"')[0];
					jQuery.ajax({
						url: url_list_sub,
						type: 'POST',
						data: formData,
						processData: false,
						contentType: false,
						success: function(subkeg){
							subkeg.data.map(function(b, i){
								if(
									b.nama_sub_giat.mst_lock != 3
									&& b.kode_sub_skpd
									&& b.kode_sbl == kode_sbl
								){
									return resolve(b.action.split("detilGiat('")[1].split("'")[0]);
								}
							})
						}
					});
				}
			});
		}else{
			return resolve(false);
		}
	});
}
