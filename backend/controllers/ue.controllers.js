// ue.controllers.js
const ueServices = require("../services/ue.services");

exports.getAllUES = async (req, res) => {
    try{
        const ues = await ueServices.getAllUE();
        if(!ues) {
            return res.status(404).json({ message : 'No ues found' });
        }
        return res.status(200).json(ues);
    } catch (e){
        return res.status(500).json({ message: e });
    }

}

exports.getUeNumber = async (req, res) => {
    try{
        const ue_number = await ueServices.countUeNumber();
        if(!ue_number) {
            return res.status(404).json({ message : 'Cannot count ue number' });
        }
        return res.status(200).json(ue_number);

    } catch (e) {
        return res.status(500).json({ message: e });
    }
}

exports.getResponsableUE = async (req, res) => {
    const code = req.params.code;
    try{
        const responsable = await ueServices.getResponsableUE(code);
        if(!responsable) {
            console.log("yaaaaa2")

            return res.status(404).json({ message : 'No responsable UE found' });
        }
        return res.status(200).json(responsable);
    } catch (e){
        console.log(e)

        return res.status(500).json({ message: e });
    }
}