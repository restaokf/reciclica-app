import { FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Address } from "src/app/model/address/Address";
import { findAddressNumber, findCity, findNeighborhood, findState, findStreet, findZipCode } from 'src/app/utils/address-utils'; 

export class RegisterPageform {
    private fromBuilder: FormBuilder;
    private form: FormGroup;

    constructor(fromBuilder: FormBuilder){
        this.fromBuilder = fromBuilder;
        this.form = this.createForm();
    }

    private createForm() : FormGroup {
        let form = this.fromBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatPassword: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            address: this.fromBuilder.group({
                street: ['', [Validators.required]],
                number: ['', [Validators.required]],
                neighborhood: ['', [Validators.required]],
                complement: ['', [Validators.required]],
                zipcode: ['', [Validators.required]],
                state: ['', [Validators.required]],
                city:['', [Validators.required]]
            })
        });

        form.get('repeatPassword')?.setValidators(matchPasswordAndRepeatPassword(form));

        return form;
    }

    setAddress(place: any) {
        const addressForm = this.form.get('address');

        addressForm?.get('street')?.setValue(findStreet(place.address_components));
        addressForm?.get('number')?.setValue(findAddressNumber(place.address_components));
        addressForm?.get('neighborhood')?.setValue(findNeighborhood(place.address_components));
        addressForm?.get('zipcode')?.setValue(findZipCode(place.address_components));
        addressForm?.get('state')?.setValue(findState(place.address_components));
        addressForm?.get('city')?.setValue(findCity(place.address_components));
    }

    getForm() : FormGroup{
        return this.form;
    }
}

function matchPasswordAndRepeatPassword(form: FormGroup) : ValidatorFn {
    const password = form.get('password');
    const repeatPassword = form.get('repeatPassword');

    const validator = () => {
        return password?.value == repeatPassword?.value ? null : {isntMatching : true}
    };

    return validator;
}