jQuery(document).ready(function () {
    var current_url = window.location.href;

    if ((current_url.indexOf('main/budget/subgiat/' + config.tahun_anggaran) != -1) || (current_url.indexOf('main/plan/subgiat/' + config.tahun_anggaran) != -1)) {	//sub_data_program_kegiatan
        var singkron_data_giat = ''
            + '<button class="fcbtn btn btn-primary btn-outline btn-1b" id="singkron_data_giat_lokal">'
            + '<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron Program Kegiatan ke DB lokal</span>'
            + '</button>';
        jQuery('#reset_submit').parent().append(singkron_data_giat);


        jQuery('#singkron_data_giat_lokal').on('click', function () {
            singkron_data_giat_lokal();
        });

        function singkron_data_giat_lokal() {
            if (confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')) {
                jQuery('#wrap-loading').show();
                var id_unit = window.location.href.split('?')[0].split('' + config.id_daerah + '/')[1];
				(function runAjax(retries, delay){
					delay = delay || 30000;
					jQuery.ajax({
						url: config.sipd_url + 'daerah/main/budget/subgiat/' + config.tahun_anggaran + '/tampil-sub-giat/' + config.id_daerah + '/' + id_unit + '?filter_program=&filter_giat=&filter_sub_giat=',
						timeout: 30000,
						contentType: 'application/json',
						success: function (data) {
							var subgiat = data.data;
							var data_prog_keg = {
								action: 'singkron_data_giat',
								tahun_anggaran: config.tahun_anggaran,
								api_key: config.api_key,
								subgiat: subgiat
							};
							console.log(data_prog_keg);
							var data = {
								message: {
									type: "get-url",
									content: {
										url: config.url_server_lokal,
										type: 'post',
										data: data_prog_keg,
										return: true
									}
								}
							};
							chrome.runtime.sendMessage(data, function (response) {
								console.log('responeMessage', response);
							});
						}
					})
					.fail(function(){
						if (retries > 0 ) {
							console.log('Koneksi error. Coba lagi'+retries); // prrint retry count
							setTimeout(function(){
								runAjax(--retries);
							},delay);
						} else {
							console.log('Koneksi error. Gagal mengambil data.');
						}
					})
				})(20);
            }
        }
    } else if (current_url.indexOf('main/budget/dana/' + config.tahun_anggaran) != -1) {

        var singkron_sumber_dana = ''
            + '<button class="fcbtn btn btn-warning btn-outline btn-1b" id="singkron_sumber_dana_lokal">'
            + '<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron Sumber Dana ke DB lokal</span>'
            + '</button>';
        jQuery('#table_dana').closest('.white-box').find('.pull-right').prepend(singkron_sumber_dana);

        jQuery('#singkron_sumber_dana_lokal').on('click', function () {
            singkron_sumber_dana_lokal();
        });

        function singkron_sumber_dana_lokal() {
            if (confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')) {
                jQuery('#wrap-loading').show();
                var id_unit = window.location.href.split('?')[0].split('' + config.id_daerah + '/')[1];
				(function runAjax(retries, delay){
					delay = delay || 30000;
					jQuery.ajax({
						url: config.sipd_url + 'daerah/main/budget/dana/' + config.tahun_anggaran + '/tampil-dana/' + config.id_daerah + '/' + id_unit,
						timeout: 30000,
						contentType: 'application/json',
						success: function (data) {
							var data_sumber_dana = {
								action: 'singkron_sumber_dana',
								tahun_anggaran: config.tahun_anggaran,
								api_key: config.api_key,
								dana: {}
							};
							data.data.map(function (dana, i) {
								data_sumber_dana.dana[i] = {};
								data_sumber_dana.dana[i].created_at = dana.created_at
								data_sumber_dana.dana[i].created_user = dana.created_user
								data_sumber_dana.dana[i].id_daerah = dana.id_daerah
								data_sumber_dana.dana[i].id_dana = dana.id_dana
								data_sumber_dana.dana[i].id_unik = dana.id_unik
								data_sumber_dana.dana[i].is_locked = dana.is_locked
								data_sumber_dana.dana[i].kode_dana = dana.kode_dana
								data_sumber_dana.dana[i].nama_dana = dana.nama_dana
								data_sumber_dana.dana[i].set_input = dana.set_input
								data_sumber_dana.dana[i].status = dana.status
								data_sumber_dana.dana[i].tahun = dana.tahun
								data_sumber_dana.dana[i].updated_at = dana.updated_at
								data_sumber_dana.dana[i].updated_user = dana.updated_user
							})
							var data = {
								message: {
									type: "get-url",
									content: {
										url: config.url_server_lokal,
										type: 'post',
										data: data_sumber_dana,
										return: true
									}
								}
							};
							chrome.runtime.sendMessage(data, function (response) {
								console.log('responeMessage', response);
							});
						}
					})
					.fail(function(){
						console.log('Koneksi error. Coba lagi',retries); // prrint retry count
						retries > 0 && setTimeout(function(){
							runAjax(--retries,30000);
						},delay);
					})
				})(20, 30000);
            }
        }
    } else if (current_url.indexOf('main/budget/rpjmd/' + config.tahun_anggaran) != -1) {      //rpjmd
        var singkron_data_rpjmd = ''
            + '<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_data_rpjmd_lokal">'
            + '<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron RPJMD ke DB lokal</span>'
            + '</button>';
        jQuery('#reset_program').parent().append(singkron_data_rpjmd);

        jQuery('#singkron_data_rpjmd_lokal').on('click', function () {
            singkron_data_rpjmd_lokal();
        });

        function singkron_data_rpjmd_lokal() {
            if (confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')) {
                jQuery('#wrap-loading').show();
                var id_unit = window.location.href.split('?')[0].split('' + config.id_daerah + '/')[1];
				(function runAjax(retries, delay){
					delay = delay || 30000;
					jQuery.ajax({
						url: config.sipd_url + 'daerah/main/budget/rpjmd/' + config.tahun_anggaran + '/tampil-rpjmd/' + config.id_daerah + '/' + id_unit + '?filter_program=&filter_indi_prog=&filter_skpd=',
						timeout: 30000,
						contentType: 'application/json',
						success: function (data) {
							var data_rpjmd = {
								action: 'singkron_data_rpjmd',
								tahun_anggaran: config.tahun_anggaran,
								api_key: config.api_key,
								rpjmd: {}
							};
							data.data.map(function (rpjmd, i) {
								data_rpjmd.rpjmd[i] = {};
								data_rpjmd.rpjmd[i].id_bidang_urusan = rpjmd.id_bidang_urusan
								data_rpjmd.rpjmd[i].id_program = rpjmd.id_program
								data_rpjmd.rpjmd[i].id_rpjmd = rpjmd.id_rpjmd
								data_rpjmd.rpjmd[i].indikator = rpjmd.indikator
								data_rpjmd.rpjmd[i].kebijakan_teks = rpjmd.kebijakan_teks
								data_rpjmd.rpjmd[i].kode_bidang_urusan = rpjmd.kode_bidang_urusan
								data_rpjmd.rpjmd[i].kode_program = rpjmd.kode_program
								data_rpjmd.rpjmd[i].kode_skpd = rpjmd.kode_skpd
								data_rpjmd.rpjmd[i].misi_teks = rpjmd.misi_teks
								data_rpjmd.rpjmd[i].nama_bidang_urusan = rpjmd.nama_bidang_urusan
								data_rpjmd.rpjmd[i].nama_program = rpjmd.nama_program
								data_rpjmd.rpjmd[i].nama_skpd = rpjmd.nama_skpd
								data_rpjmd.rpjmd[i].pagu_1 = rpjmd.pagu_1
								data_rpjmd.rpjmd[i].pagu_2 = rpjmd.pagu_2
								data_rpjmd.rpjmd[i].pagu_3 = rpjmd.pagu_3
								data_rpjmd.rpjmd[i].pagu_4 = rpjmd.pagu_4
								data_rpjmd.rpjmd[i].pagu_5 = rpjmd.pagu_5
								data_rpjmd.rpjmd[i].sasaran_teks = rpjmd.sasaran_teks
								data_rpjmd.rpjmd[i].satuan = rpjmd.satuan
								data_rpjmd.rpjmd[i].strategi_teks = rpjmd.strategi_teks
								data_rpjmd.rpjmd[i].target_1 = rpjmd.target_1
								data_rpjmd.rpjmd[i].target_2 = rpjmd.target_2
								data_rpjmd.rpjmd[i].target_3 = rpjmd.target_3
								data_rpjmd.rpjmd[i].target_4 = rpjmd.target_4
								data_rpjmd.rpjmd[i].target_5 = rpjmd.target_5
								data_rpjmd.rpjmd[i].tujuan_teks = rpjmd.tujuan_teks
								data_rpjmd.rpjmd[i].visi_teks = rpjmd.visi_teks
								data_rpjmd.rpjmd[i].update_at = rpjmd.update_at
							})
							var data = {
								message: {
									type: "get-url",
									content: {
										url: config.url_server_lokal,
										type: 'post',
										data: data_rpjmd,
										return: true
									}
								}
							};
							chrome.runtime.sendMessage(data, function (response) {
								console.log('responeMessage', response);
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
	} else if ((current_url.indexOf('/main/plan/reses/') != -1)||(current_url.indexOf('/main/plan/asmas/') != -1)) { //Usulan Masyarakat ataupun Reses / Pokok Pikiran
		var ta = window.location.href.split('/')[7];
		var singkron_data_usulan = ''
			+ '<div class="pull-right p-t-10 m-b-20">'
            + '<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_data_usulan_lokal">'
            + '<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron Usulan ke DB lokal</span>'
			+ '</button>'
			+ '</div>';
        jQuery('.panel-heading').append(singkron_data_usulan);

        jQuery('#singkron_data_usulan_lokal').on('click', function () {
			if (current_url.indexOf('/main/plan/reses/') != -1) {
				singkron_data_usulan_lokal("reses",ta);
			} else {
				singkron_data_usulan_lokal("asmas",ta);
			}
        });

        function singkron_data_usulan_lokal(jenis,ta) {
            if (confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')) {
				jQuery('#wrap-loading').show();
				proses_data_usulan(jenis,'verif_mitra',ta);
				proses_data_usulan(jenis,'verif_tapd',ta);
				proses_data_usulan(jenis,'monitor',ta);
				proses_data_usulan(jenis,'tolak',ta);
				proses_data_usulan(jenis,'',ta);
				jQuery('#wrap-loading').hide();
            }
        }
	} else if ((current_url.indexOf('/main/plan/kamus-usulan/' + config.tahun_anggaran + '/asmas/list') != -1) || (current_url.indexOf('/main/plan/kamus-usulan/' + config.tahun_anggaran + '/reses/list') != -1)) { //Kamus Usulan Masyarakat
		var html_impor_kamus = ''
			+ '<input type="file" id="excelfile" />'
			+ '<input type="button" id="impor_kamus" value="Impor Kamus ke Sistem" />';
		jQuery('.panel-heading').append(html_impor_kamus);
		if (current_url.indexOf('/main/plan/kamus-usulan/' + config.tahun_anggaran + '/asmas/list') != -1) {
			jenis = 'asmas';
		} else {
			jenis = 'reses';
		}
        jQuery('#impor_kamus').on('click', function () {
			imporKamus(jenis);
        });
	} else if (current_url.indexOf('/main/budget/rekap/' + config.tahun_anggaran + '/belanja/') != -1) { 
		var ta = window.location.href.split('/')[7];
		var html_impor_rekap = ''
			+ '<input type="button" id="impor_rekap" value="Impor Rekap ke Lokal" />';
		jQuery('.white-box').prepend(html_impor_rekap);
        jQuery('#impor_rekap').on('click', function () {
			imporRekap(ta,18);
        });
	}
})
function proses_data_usulan (jenis,level,ta,callback) {
	if (level == 'verif_mitra') {
		var url = config.sipd_url + 'daerah/main/plan/'+jenis+'/' + ta + '/tampil-verif-usulan/' + config.id_daerah + '/0?verif_skpd=0&valid_tapd=0';
	} else if (level == 'verif_tapd') {
		var url = config.sipd_url + 'daerah/main/plan/'+jenis+'/' + ta + '/tampil-verif-usulan/' + config.id_daerah + '/0?verif_skpd=0&valid_tapd=1';
	} else if (level == 'monitor') {
		var url = config.sipd_url + 'daerah/main/plan/'+jenis+'/' + ta + '/tampil-monitor/' + config.id_daerah + '/0';
	} else if (level == 'tolak') {
		var url = config.sipd_url + 'daerah/main/plan/'+jenis+'/' + ta + '/tampil-usul-tolak/' + config.id_daerah + '/0';
	} else var url = config.sipd_url + 'daerah/main/plan/'+jenis+'/' + ta + '/tampil-usulan/' + config.id_daerah + '/0';
	// jQuery('#wrap-loading').show();
	// jQuery('#persen-loading').attr('persen', 0);
	// jQuery('#persen-loading').html('0%');
	(function runAjax(retries, delay){
		delay = delay || 30000;
		jQuery.ajax({
			url: url,
			timeout: 180000,
			contentType: 'application/json',
			success: function (data) {
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
							var sendData = current_data.map(function(usulan, n){
								return new Promise(function(resolve, reject){
									if (jenis === 'reses') {
										var id_usulan = usulan.id_reses;
									} else {
										var id_usulan = usulan.id_usulan;
									}	
									(function runAjax1(retries, delay) {
										delay = delay || 30000;
										jQuery.ajax({
											url: config.sipd_url + 'daerah/main/plan/' + jenis + '/' + ta + "/detil-usulan/" + config.id_daerah + "/0",
											type: "post",
											timeout: 30000,
											data: "_token=" + jQuery('meta[name=_token]').attr('content') + '&idusulan=' + id_usulan,
											success: function (rinciusulan_) {
												data_usulan_ = usulan;
												jQuery.extend(data_usulan_, rinciusulan_);
												delete (data_usulan_.id_usulan);
												delete (data_usulan_.id_reses);
												delete (data_usulan_.rekom_camat);
												delete (data_usulan_.rekom_setwan);
												delete (data_usulan_.rekom_lurah);
												delete (data_usulan_.rekom_desa);
												delete (data_usulan_.rekom_mitra);
												delete (data_usulan_.rekom_skpd);
												delete (data_usulan_.rekom_tapd);
												delete (data_usulan_.rekom_camat);
												delete (data_usulan_.setPilih);
												if (jenis === 'reses') data_usulan_.id_reses = id_usulan;
												if (jenis === 'asmas') data_usulan_.id_usulan = id_usulan;
												if (level === 'verif_mitra') {
													data_usulan_.verif_skpd = 0;
													data_usulan_.valid_tapd = 0;
												} else if (level === 'verif_tapd') {
													data_usulan_.verif_skpd = 0;
													data_usulan_.valid_tapd = 1;
												}
												if (usulan.rekom_camat) {
													data_usulan_.rekom_camat_rekomendasi = usulan.rekom_camat.rekomendasi;
													data_usulan_.rekom_camat_koefisien = usulan.rekom_camat.koefisien;
													data_usulan_.rekom_camat_anggaran = usulan.rekom_camat.anggaran;
												}
												if (usulan.rekom_setwan) {
													data_usulan_.rekom_setwan_rekomendasi = usulan.rekom_setwan.rekomendasi;
													data_usulan_.rekom_setwan_koefisien = usulan.rekom_setwan.koefisien;
													data_usulan_.rekom_setwan_anggaran = usulan.rekom_setwan.anggaran;
												}
												if (usulan.rekom_lurah) {
													data_usulan_.rekom_lurah_rekomendasi = usulan.rekom_lurah.rekomendasi;
													data_usulan_.rekom_lurah_koefisien = usulan.rekom_lurah.koefisien;
													data_usulan_.rekom_lurah_anggaran = usulan.rekom_lurah.anggaran;
												}
												if (usulan.rekom_mitra) {
													data_usulan_.rekom_mitra_rekomendasi = usulan.rekom_mitra.rekomendasi;
													data_usulan_.rekom_mitra_koefisien = usulan.rekom_mitra.koefisien;
													data_usulan_.rekom_mitra_anggaran = usulan.rekom_mitra.anggaran;
												}
												if (usulan.rekom_skpd) {
													data_usulan_.rekom_skpd_rekomendasi = usulan.rekom_skpd.rekomendasi;
													data_usulan_.rekom_skpd_koefisien = usulan.rekom_skpd.koefisien;
													data_usulan_.rekom_skpd_anggaran = usulan.rekom_skpd.anggaran;
												}
												if (usulan.rekom_tapd) {
													data_usulan_.rekom_tapd_rekomendasi = usulan.rekom_tapd.rekomendasi;
													data_usulan_.rekom_tapd_koefisien = usulan.rekom_tapd.koefisien;
													data_usulan_.rekom_tapd_anggaran = usulan.rekom_tapd.anggaran;
												}
												data_usulan_.active = 1; 
												return resolve(data_usulan_);
											}
										})
										.fail(function () {
											console.log('Koneksi error. Coba lagi' + retries); // prrint retry count
											retries > 0 && setTimeout(function () {
												runAjax1(--retries);
											}, delay);
										});
									})(20);
								})
								.catch(function(e){
									console.log(e);
									return Promise.resolve(usulan);
								});
							});

							Promise.all(sendData)
							.then(function(all_usulan){
								var opsi = {
									action: 'singkron_data_usulan',
									tahun_anggaran: ta,
									jenis: jenis,
									api_key: config.api_key,
									data_usulan: all_usulan
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
								console.log('All Usulan',all_usulan);
								if (all_usulan.length > 0) {
									chrome.runtime.sendMessage(data, function(response) {
										console.log('responeMessage', response);
									});
								} 
								// var c_persen = +jQuery('#persen-loading').attr('persen');
								// c_persen++;
								// jQuery('#persen-loading').attr('persen', c_persen);
								// jQuery('#persen-loading').html(((c_persen/data_all.length)*100).toFixed(2)+'%');
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
					// jQuery('#wrap-loading').hide();
					// jQuery('#persen-loading').html('');
					// jQuery('#persen-loading').attr('persen', '');
					// jQuery('#persen-loading').attr('total', '');
					// sweetAlert('Data berhasil disimpan di database lokal!');
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
//	return callback();
}

function imporRekap(ta,jenis) {
	(function runAjax(retries, delay){
		delay = delay || 30000;
		jQuery.ajax({
			url: config.sipd_url + 'daerah/main/budget/rekap/' + ta + '/tampil-belanja/' + config.id_daerah + '/0?model=sub_bl_prog_sub_giat_rek',
			timeout: 60000,
			contentType: 'application/json',
			success: function (data) {
				var data_all = [];
				var data_sementara = [];
				console.log(data.data.length);
				data.data.map(function(b, i){
					//console.log(i);
					data_sementara.push(b);
					var n = i+1;
					if(n%500 == 0 || n == data.data.length){
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
							var sendData = current_data.map(function(rekap_, n){
								return new Promise(function(resolve, reject){
									data_rekap_ = rekap_;
									return resolve(data_rekap_);
								})
								.catch(function(e){
									console.log(e);
									return Promise.resolve(rekap_);
								});
							});
							Promise.all(sendData)
							.then(function(all_rekap){
								var opsi = {
									action: 'singkron_data_rekap',
									tahun_anggaran: ta,
									jenis: jenis,
									api_key: config.api_key,
									data_rekap: all_rekap
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
								console.log('All Rekap',all_rekap);
								if (all_rekap.length > 0) {
									chrome.runtime.sendMessage(data, function(response) {
										console.log('Respon Send Rekap', response);
									});
								} 
								// var c_persen = +jQuery('#persen-loading').attr('persen');
								// c_persen++;
								// jQuery('#persen-loading').attr('persen', c_persen);
								// jQuery('#persen-loading').html(((c_persen/data_all.length)*100).toFixed(2)+'%');
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
					// jQuery('#wrap-loading').hide();
					// jQuery('#persen-loading').html('');
					// jQuery('#persen-loading').attr('persen', '');
					// jQuery('#persen-loading').attr('total', '');
					// sweetAlert('Data berhasil disimpan di database lokal!');
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
}
function imporKamus(jenis) {  
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;  
	/*Checks whether the file is a valid excel file*/  
	if (regex.test($("#excelfile").val().toLowerCase())) {  
		var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/  
		if ($("#excelfile").val().toLowerCase().indexOf(".xlsx") > 0) {  
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
						inputKamus(jenis,exceljson);
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

function inputKamus(jenis,jsondata) {/*Function used to input the JSON array to Kamus Usulan SIPD*/  
	var columns = getHeader(jsondata); /*Gets all the column headings of Excel*/  
	//console.log(jsondata);
	for (var i = 0; i < jsondata.length; i++) {  
		for (var colIndex = 0; colIndex < columns.length; colIndex++) {  
			var cellValue = jsondata[i][columns[colIndex]];  
			if (cellValue == null)  
				cellValue = "";  
		}  
		//data: "_token=" + jQuery('meta[name=_token]').attr('content') + '&idusulan=' + id_usulan,
		opsi = {
			_token : jQuery('meta[name=_token]').attr('content'),
			id_kamus: '',
			jenis_bantuan: '',
			isu_usulan: jsondata[i]['isu_usulan'],
			program_usulan: jsondata[i]['program_usulan'],
			jenis_giat: '',
			giat_teks: jsondata[i]['giat_teks'],
			pd_tujuan: jsondata[i]['pd_tujuan'],
			satuan: '',
			harga_satuan: '',
			outcome_teks: '',
			output_teks: '',
			jenis_usulan: ''
		}
		jQuery.ajax({
			//https://karawangkab.sipd.kemendagri.go.id/daerah/main/plan/kamus-usulan/2020/asmas/simpan-kamus/17/0
		    url: config.sipd_url + 'daerah/main/plan/kamus-usulan/' + config.tahun_anggaran + '/' + jenis + '/simpan-kamus/' + config.id_daerah + '/0',
		    type: 'post',
		    data: opsi,
		    success:function(ret){
		        console.log('Input Usulan',ret);
		    },
		    error:function(){
				console.log('Input Usulan error');
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
	console.log(columnSet);
	return columnSet;  
}  
