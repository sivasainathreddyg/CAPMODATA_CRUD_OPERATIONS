sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Fragment) {
        "use strict";
        var that;

        return Controller.extend("com.crudodata.capmodatacrud.controller.Main", {
            onInit: function () {
                that = this;
                that.value = 0;
                var datamodel = that.getOwnerComponent().getModel()
                datamodel.read("/Interactions_Student_data");
                this.getView().setModel(datamodel);
                var oView = this.getView();
                if (!this._oDialog) {
                    // Load the fragment asynchronously
                    Fragment.load({
                        id: oView.getId(),
                        name: "com.crudodata.capmodatacrud.fragments.odatalist", // Replace with the actual fragment name
                        controller: this
                    }).then(function (oDialog) {
                        // Set the dialog to the controller's property
                        this._oDialog = oDialog;
                        oView.addDependent(this._oDialog);

                        // Open the dialog

                        // this._oDialog.open();

                    }.bind(this));
                }
            },
            onFragment: function (oEvent) {


                if (oEvent.getSource().getText() === "AddStudentDetails") {
                    this.getView().byId("buttonid").setText("Submit")
                    this.getView().byId("idinput").setEnabled(true)

                } else {
                    this.getView().byId("buttonid").setText("Update")
                    this.getView().byId("idinput").setEnabled(false)
                    var selecteditem = oEvent.getSource().getParent();
                    var oBindingContext = selecteditem.getBindingContext();

                    var omodel = this.getView().getModel();
                    var odata = omodel.getProperty(oBindingContext.getPath());

                    this.getView().byId('idinput').setValue(odata.ID);
                    this.getView().byId('nameinput').setValue(odata.NAME);
                    this.getView().byId('contactinput').setValue(odata.CONTACT);
                    this.getView().byId('DOBinput').setValue(odata.DATEOFBIRTH);

                    this.getView().byId("editFields").setVisible(true);
                }
                // If the fragment is already instantiated, just open it
                this._oDialog.open();

            },
            onClear: function () {
                this.getView().byId("idinput").setValue("");
                this.getView().byId("nameinput").setValue("");
                this.getView().byId("contactinput").setValue("");
                this.getView().byId("DOBinput").setValue("");
            },
            onclose: function () {
                if (this._oDialog) {
                    this._oDialog.close();
                    that.onClear();
                }

            },
            createData: function (oEvent) {

                if (oEvent.getSource().getText() === "Submit") {
                    this.Submit(true)

                } else {
                    this.Onupdate(true)
                }

            },
            Submit: function () {
                var Id = this.getView().byId("idinput").getValue();
                var Name = this.getView().byId("nameinput").getValue();
                var Contact = this.getView().byId("contactinput").getValue();
                var DOB = this.getView().byId("DOBinput").getValue();
                var Data = {
                    ID: parseInt(Id),
                    NAME: Name,
                    CONTACT: Contact,
                    DATEOFBIRTH: DOB
                };
                var OMOdel = this.getView().getModel();
                this.getView().setBusy(true);
                OMOdel.create("/Interactions_Student_data", Data, {
                    success: function (oData, response) {
                        MessageBox.success("Data Successfully Created");
                        //console.log("Success Response:", response);
                        this.getView().setBusy(false);
                        this.getView().byId("studenttable").setBusy(false);
                        this.onclose(true);


                    }.bind(this),
                    error: function (oerror) {
                        MessageBox.error("Data Not Successfully created");
                        //sap.m.MessageToast.show(JSON.parse(oerror.responseText).error.message.value);
                        this.getView().setBusy(false);
                        this.getView().byId("studenttable").setBusy(false)

                    }.bind(this)
                });

            },
            Onupdate: function (oEvent) {
                var Id = this.getView().byId("idinput").getValue();
                var Name = this.getView().byId("nameinput").getValue();
                var Contact = this.getView().byId("contactinput").getValue();
                var DOB = this.getView().byId("DOBinput").getValue();
                var Data = {
                    ID: parseInt(Id),
                    NAME: Name,
                    CONTACT: Contact,
                    DATEOFBIRTH: DOB
                };
                var OMOdel = this.getView().getModel();
                this.getView().setBusy(true);
                OMOdel.update("/Interactions_Student_data/" + parseInt(Id), Data, {
                    success: function (oData, response) {
                        //console.log("Success Response:", response);
                        this.getView().setBusy(false);
                        this.getView().byId("studenttable").setBusy(false)
                        this.onclose(true);
                        MessageBox.success("Data Successfully updated");


                    }.bind(this),
                    error: function (oerror) {
                        MessageBox.error("Data Not Successfully updated");
                        //sap.m.MessageToast.show(JSON.parse(oerror.responseText).error.message.value);
                        this.getView().setBusy(false);
                        this.getView().byId("studenttable").setBusy(false)
                    }.bind(this)
                });

            },
            OnDelete: function (oEvent) {
                var sID = oEvent.getParameters()["listItem"].getCells()[0].getText();
                sap.m.MessageBox.confirm("Are you sure want delete the record", {
                    title: "Confirm",
                    onClose: function (sAction) {
                        if (sAction === "OK") {
                            this.onDeleteSpecificRecord(sID)
                        }
                    }.bind(this),
                    actions: [sap.m.MessageBox.Action.OK,
                    sap.m.MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                });
            },
            onDeleteSpecificRecord: function (sid) {
                var odatamodel = this.getOwnerComponent().getModel();
                odatamodel.remove("/Interactions_Student_data/" + parseInt(sid), {
                    success: function (oData, response) {
                        MessageBox.success("Data Successfully deleted");
                        // console.log("Success Response:", response);
                        this.getView().byId("studenttable").setBusy(false);

                    }.bind(this),
                    error: function (oerror) {
                        MessageBox.error("Data Not Successfully deleted");
                        //console.error("Error:", oerror);
                        this.getView().byId("studenttable").setBusy(false);

                    }.bind(this)

                })


            }



        });
    });

