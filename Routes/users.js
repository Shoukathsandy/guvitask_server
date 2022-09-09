import express, { application } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getlogindata, getusername, profiledata } from "./helper.js";






const router = express.Router();

async function genhashpassword(password) {
    //no.of.salting = 10
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    // console.log(hashedpassword);
    return hashedpassword;
};

router.post("/register", async function (req, res) {
    try {
        const { name,email, password,confirmPassword } = req.body;
        const hashedpassword = await genhashpassword(password);
        const existuser = await getusername(email);

        if (existuser) {
            console.log(existuser)
            res.status(422).send({ error: "Already email exist" });
            console.log(existuser.error);
        } else {
            if(password==confirmPassword){
                const result = getlogindata({ email: email, password: hashedpassword,name:name,confirmPassword:confirmPassword });
                res.status(200).send({ msg: "sucessfully registered" });
            }else{
               res.status(401).send({error:"password and confirm password not matched"});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal server error" });
    };
});

router.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;
        const existuser = await getusername(email);
        if (!existuser) {
            res.status(401).send({ error: "User dose not exist" })
        } else {
            const storedpassword = existuser.password;
            const ispasswordmatch = await bcrypt.compare(password, storedpassword);
            if (ispasswordmatch) {

                const token = jwt.sign({ id: existuser._id }, process.env.SECRET_KEY);

                res.send({ msg: "sucessfull login", token: token, email: email, id: existuser._id });

            } else {
                res.status(401).send({ error: "Invalid password or email" });
            }
        }
    } catch (error) {
        res.status(500).send({ error: "Internal server error" });
    }
});

//save profile details
router.post("/profile",async function(req,res){
    try {
        const data = req.body;
        if(data){
            const result = await profiledata(data);
            res.status(201).send({msg:"saved successfully"});
        }else{
            res.status(401).send({error:"data not entered"})
        }
    } catch (error) {
        res.status(500).send({ error: "Internal server error" });
    }
})

export const userRouter = router;