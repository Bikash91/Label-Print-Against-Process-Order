sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem"
], function (Controller, MessageBox, JSONModel, Device, Button, Dialog, List, StandardListItem) {
	"use strict";

	return Controller.extend("com.sap.upl.LabelPrintAgainstProcessOrder.controller.ProcessOrder", {

		onInit: function () {
			jQuery.sap.delayedCall(200, this, function () {
				this.byId("ProcessOrder").focus();
			});

			this.onlyNumber(this.byId("ProcessOrder"));
			this.onlyNumber(this.byId("ItemCode"));
			this.onlyQuantity(this.byId("QuantityPerLabel"));
			this.onlyNumber(this.byId("NoOfLabel"));

			this.path = "/sap/fiori/zlabelprintagainstprocessorder/" + this.getOwnerComponent().getModel("soundModel").sServiceUrl +
				"/SoundFileSet('sapmsg1.mp3')/$value";
		},

		onAfterRendering: function () {
			jQuery.sap.delayedCall(200, this, function () {
				this.byId("ProcessOrder").focus();
			});
			this.onlyNumber(this.byId("ItemCode"));
			this.onlyQuantity(this.byId("QuantityPerLabel"));
			this.onlyNumber(this.byId("NoOfLabel"));
		},

		onlyNumber: function (element) {
			element.attachBrowserEvent("keydown", (function (e) {
				var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
				var isCursorMoveOrDeleteAction = ([46, 8, 37, 38, 39, 40, 9].indexOf(e.keyCode) !== -1);
				var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >= 96 && e.keyCode <= 105);
				var vKey = 86,
					cKey = 67,
					aKey = 65;
				switch (true) {
				case isCursorMoveOrDeleteAction:
				case isModifierkeyPressed === false && isNumKeyPressed:
				case (e.metaKey || e.ctrlKey) && ([vKey, cKey, aKey].indexOf(e.keyCode) !== -1):
					break;
				default:
					e.preventDefault();
				}
			}));
		},
		onlyQuantity: function (element) {
			element.attachBrowserEvent("keydown", (function (e) {
				var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
				var isCursorMoveOrDeleteAction = ([46, 8, 37, 38, 39, 40, 9, 190].indexOf(e.keyCode) !== -1);
				var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >= 96 && e.keyCode <= 105);
				var vKey = 86,
					cKey = 67,
					aKey = 65;
				switch (true) {
				case isCursorMoveOrDeleteAction:
				case isModifierkeyPressed === false && isNumKeyPressed:
				case (e.metaKey || e.ctrlKey) && ([vKey, cKey, aKey].indexOf(e.keyCode) !== -1):
					break;
				default:
					e.preventDefault();
				}
			}));
		},

		onCheckAllField: function (oEvt) {
			if (oEvt.getSource().getValue() != "") {
				oEvt.getSource().setValueState("None");
			}

			if (oEvt.getSource().getName() == "ProcessOrder") {
				if (oEvt.getSource().getValue() != "") {
					/*jQuery.sap.delayedCall(200, this, function () {
						this.byId("ItemCode").focus();
					});*/

					this.checkQuantity(oEvt);
				}
			}
			/*else if (oEvt.getSource().getName() == "ItemCode") {
				if (oEvt.getSource().getValue() != "") {
					jQuery.sap.delayedCall(200, this, function () {
						this.byId("LotNumber").focus();
					});
				}
			} else if (oEvt.getSource().getName() == "LotNumber") {
				if (oEvt.getSource().getValue() != "") {
					jQuery.sap.delayedCall(200, this, function () {
						this.byId("QuantityPerLabel").focus();
					});
				}
			}*/
			else if (oEvt.getSource().getName() == "QuantityPerLabel") {
				this.checkQuantitylabel();
				if (oEvt.getSource().getValue() != "") {
					jQuery.sap.delayedCall(200, this, function () {
						this.byId("NoOfLabel").focus();
					});
				}
			} else {
				this.noOflabel(oEvt);
				if (oEvt.getSource().getValue() != "") {
					jQuery.sap.delayedCall(200, this, function () {
						//$('.SelectPrinter input').focus();
						document.activeElement.blur();
					});
				}
			}
		},

		quantity: 0,

		checkQuantitylabel: function () {
			debugger;
			if (this.byId("ProcessOrder").getValue() == "") {
				var audio = new Audio(this.path);
				audio.play();
				this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
				jQuery.sap.delayedCall(5000, this, function () {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("provideprocessorder"), {
						icon: MessageBox.Icon.ERROR,
						title: "Error",
						contentWidth: "100px",
						onClose: function (oAction) {
							if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
								jQuery.sap.delayedCall(200, this, function () {
									this.byId("ProcessOrder").focus();
									this.getOwnerComponent().getModel("processModel").setProperty("/Nooflabel", "");
									this.getOwnerComponent().getModel("processModel").setProperty("/Quantity", "");
								});
							}
						}.bind(this)
					});
				});
				return;
			}
			if (this.getOwnerComponent().getModel("processModel").getProperty("/Nooflabel") != "") {
				var checkQuan = parseFloat(this.getOwnerComponent().getModel("processModel").getProperty("/Quantity")) *
					parseFloat(this.getOwnerComponent().getModel("processModel").getProperty("/Nooflabel"));
				if (this.quantity < checkQuan) {
					var audio = new Audio(this.path);
					audio.play();
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
					jQuery.sap.delayedCall(5000, this, function () {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("quanexeeding"), {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
									jQuery.sap.delayedCall(200, this, function () {
										this.byId("QuantityPerLabel").focus();
										this.getOwnerComponent().getModel("processModel").setProperty("/Quantity", "");
										this.getOwnerComponent().getModel("processModel").setProperty("/Nooflabel", "");
									});
								}
							}.bind(this)
						});
					});
				}
			}
		},
		noOflabel: function (oEvt) {
			debugger;
			if (this.byId("ProcessOrder").getValue() == "") {
				var audio = new Audio(this.path);
				audio.play();
				this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
				jQuery.sap.delayedCall(5000, this, function () {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("provideprocessorder"), {
						icon: MessageBox.Icon.ERROR,
						title: "Error",
						contentWidth: "100px",
						onClose: function (oAction) {
							if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
								jQuery.sap.delayedCall(200, this, function () {
									this.byId("ProcessOrder").focus();
									this.getOwnerComponent().getModel("processModel").setProperty("/Nooflabel", "");
									this.getOwnerComponent().getModel("processModel").setProperty("/Quantity", "");
								});
							}
						}.bind(this)
					});
				});
				return;
			}

			if (this.getOwnerComponent().getModel("processModel").getProperty("/Quantity") != "") {
				var checkQuan = parseFloat(this.getOwnerComponent().getModel("processModel").getProperty("/Quantity")) *
					parseFloat(this.getOwnerComponent().getModel("processModel").getProperty("/Nooflabel"));
				if (this.quantity < checkQuan) {
					var audio = new Audio(this.path);
					audio.play();
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
					jQuery.sap.delayedCall(5000, this, function () {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("quanexeeding"), {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
									jQuery.sap.delayedCall(200, this, function () {
										this.byId("NoOfLabel").focus();
										this.getOwnerComponent().getModel("processModel").setProperty("/Nooflabel", "");
									});
								}
							}.bind(this)
						});
					});
				}
			}
		},

		checkQuantity: function (oEvt) {
			var path = "/CheckQuantitySet(Processorder='" + oEvt.getSource().getValue() + "')";
			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			this.getOwnerComponent().getModel().read(path, {
				success: function (odata, oresponse) {

					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					jQuery.sap.delayedCall(200, this, function () {
						this.byId("QuantityPerLabel").focus();
					});
					this.quantity = parseFloat(odata.Quantity);
					this.getOwnerComponent().getModel("processModel").setProperty("/Material", odata.Material);
					this.getOwnerComponent().getModel("processModel").setProperty("/Batch", odata.Batch);
					this.getOwnerComponent().getModel("processModel").refresh();
					this.getOwnerComponent().getModel("processModel").updateBindings();
				}.bind(this),
				error: function (oError) {
					var audio = new Audio(this.path);
					audio.play();
					jQuery.sap.delayedCall(5000, this, function () {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
						this.getOwnerComponent().getModel("processModel").setProperty("/Processorder", "");
						this.getOwnerComponent().getModel("processModel").setProperty("/Material", "");
						this.getOwnerComponent().getModel("processModel").setProperty("/Batch", "");
						this.getOwnerComponent().getModel("processModel").setProperty("/Quantity", "");
						this.getOwnerComponent().getModel("processModel").setProperty("/Nooflabel", "");
						this.getOwnerComponent().getModel("processModel").refresh();
						this.getOwnerComponent().getModel("processModel").updateBindings();
					});
					if (JSON.parse(oError.responseText).error.innererror.errordetails.length > 1) {
						var x = JSON.parse(oError.responseText).error.innererror.errordetails;
						var details = '<ul>';
						var y = '';
						if (x.length > 1) {
							for (var i = 0; i < x.length - 1; i++) {
								y = '<li>' + x[i].message + '</li>' + y;
							}
						}
						details = details + y + "</ul>";
						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("unabletogetprocessorder"), {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							details: details,
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction == "OK" || oAction == "CANCEL" || oAction == "CLOSE") {
									jQuery.sap.delayedCall(200, this, function () {
										this.byId("ProcessOrder").focus();
									});
								}
							}.bind(this)
						});
					} else {
						MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
									this.getOwnerComponent().getModel("processModel").setProperty("/ProcessOrder", "");
									this.getOwnerComponent().getModel("processModel").setProperty("/Material", "");
									this.getOwnerComponent().getModel("processModel").setProperty("/Batch", "");
									this.getOwnerComponent().getModel("processModel").setProperty("/Quantity", "");
									this.getOwnerComponent().getModel("processModel").setProperty("/Nooflabel", "");
									this.getOwnerComponent().getModel("processModel").refresh();
									this.getOwnerComponent().getModel("processModel").updateBindings();
									jQuery.sap.delayedCall(200, this, function () {
										this.byId("Processorder").focus();
									});
								}
							}.bind(this)
						});
					}
				}.bind(this)
			});
		},

		getFormField: function (oFormContent) {
			var c = 0;
			for (var i = 0; i < oFormContent.length; i++) {
				if (oFormContent[i].getMetadata()._sClassName === "sap.m.Input" || oFormContent[i].getMetadata()._sClassName === "sap.m.ComboBox") {
					if (oFormContent[i].getValue() == "" && oFormContent[i].getVisible() == true) {
						oFormContent[i].setValueState("Error");
						oFormContent[i].setValueStateText(oFormContent[i - 1].getText() + " " +this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
							"isX"));
						oFormContent[i].focus();
						c++;
						return c;
					}
				}
			}
		},

		checkAvailablePrinter: function () {
			if (!this.printerDialog) {
				this.printerDialog = new sap.m.Dialog({
					title: 'Available Printers',
					buttons: [
						new sap.m.Button({
							text: "Ok",
							type: "Emphasized",
							press: function () {
								this.printerDialog.close();
							}.bind(this)
						})
					],
					content: new List({
						items: {
							path: '/ProductCollection',
							template: new StandardListItem({
								type: 'Active',
								title: "{Name}",
								counter: "{Quantity}",
								press: function () {
									this.printerDialog.close();
								}.bind(this)
							})
						}
					}),
				});
			}

			this.printerDialog.open();
		},

		onPressPrint: function () {
			var count = this.getFormField(this.byId("idProcessOrder").getContent());
			if (count > 0) {
				//audio.play();
				this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
				jQuery.sap.delayedCall(200, this, function () {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("allmandatory"));
				});
				return;
			}

			//this.checkAvailablePrinter();

			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			var path = "/ProcessOrderLabelSet(Processorder='" + this.getOwnerComponent().getModel("processModel").getProperty("/Processorder") +
				"',Nooflabel='" + this.getOwnerComponent().getModel("processModel").getProperty("/Nooflabel") + "')";

			this.getOwnerComponent().getModel().read(path, {
				success: function (oData) {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					MessageBox.success(oData.Message, {
						icon: MessageBox.Icon.SUCCESS,
						title: "Success",
						contentWidth: "100px",
						onClose: function (oAction) {
							if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE" || oAction === null) {
								var processData = new JSONModel({
									Processorder: "",
									Material: "",
									Batch: "",
									Quantity: "",
									Nooflabel: ""
								});
								this.getOwnerComponent().setModel(processData, "processModel");
								this.getOwnerComponent().getModel("processModel").refresh();
								this.getOwnerComponent().getModel("processModel").updateBindings();
								jQuery.sap.delayedCall(200, this, function () {
									this.byId("ProcessOrder").focus();
								});
							}
						}.bind(this)
					});
				}.bind(this),
				error: function (oError) {
					var audio = new Audio(this.path);
					audio.play();
					jQuery.sap.delayedCall(5000, this, function () {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					});
					if (JSON.parse(oError.responseText).error.innererror.errordetails.length > 1) {
						var x = JSON.parse(oError.responseText).error.innererror.errordetails;
						var details = '<ul>';
						var y = '';
						if (x.length > 1) {
							for (var i = 0; i < x.length - 1; i++) {
								y = '<li>' + x[i].message + '</li>' + y;
							}
						}
						details = details + y + "</ul>";
						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("unabletoprint"), {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							details: details,
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction == "OK" || oAction == "CANCEL" || oAction == "CLOSE") {

								}
							}.bind(this)
						});
					} else {
						MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {

								}
							}.bind(this)
						});
					}

				}.bind(this)
			});
		}
	});

});