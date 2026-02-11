import * as Yup from "yup";
import { FormikErrors } from "formik";
import { emailRegex, phoneRegex } from "../../../../constant/commonFunctions";

// ContactPersonSchema
export const ContactPersonSchemaValidationSchema = Yup.object().shape({
    contactPerson: Yup.string()
        .trim()
        .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
        .min(2, "Must be at least 2 characters")
        .max(50, "Must be at most 50 characters")
        .required("Contact person name is required"),
    designation: Yup.string()
        .trim()
        .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
        .min(2, "Must be at least 2 characters")
        .max(50, "Must be at most 50 characters")
        .required("Designation is required"),
    mobile: Yup.string()
        .trim()
        .matches(phoneRegex, "Mobile number must be exactly 10 digits")
        .required("Mobile number is required"),
    email: Yup.string()
        .trim()
        .matches(emailRegex, "please enter valid email")
        .email("Invalid email format")
        .required("Email is required"),
});

// OrganizationInfo
export const OrganizationInfoValidationSchema = (updateUserDetails: boolean) =>
    Yup.object({
        typeOfCompany: Yup.string().required("Type of Company is required"),
        cin: Yup.string().when("typeOfCompany", {
            is: "section",
            then: (schema) =>
                schema
                    .required("CIN is required for Section companies")
                    .matches(
                        /^[LU]\d{5}[A-Z]{2}\d{4}([A-Z]{3}|[0-9]{3})\d{6}$/,
                        "Enter Valid CIN eg.(L78678MH2005PTC008967)"
                    ),
            otherwise: (schema) => schema.notRequired(),
        }),
        organisationName: Yup.string()
            .min(2, "Organization name must be at least 2 characters")
            .max(80, "Organization name must be at most 80 characters")
            .required("Organization name is required"),
        email: Yup.string()
            .trim()
            .required("Email is required")
            .matches(
                /^[^\s+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please enter a valid email address"
            ),
        Mailotp: Yup.lazy(() => updateUserDetails ? Yup.string().trim().notRequired() : Yup.string().trim().required("Please verify email")),
        mobile: Yup.string()
            .trim()
            .matches(/^[1-9]\d{9}$/, "Mobile number must be 10 digits starting with 1-9")
            .required("Mobile number is required"),
        dateOfInc: Yup.date()
            .max(new Date(), "Date of Incorporation cannot be in the future")
            .required("Date of Incorporation is required"),
        registerAdd: Yup.string()
            .min(5, "Registered Address must be at least 5 characters")
            .required("Registered Address is required"),
        pinCode: Yup.string()
            .trim()
            .matches(/^\d{6}$/, "PIN Code must be exactly 6 digits")
            .required("PIN Code is required"),
        stateName: Yup.string()
            .matches(/^[A-Za-z\s]+$/, "State name can only contain letters and spaces")
            .required("State name is required"),
        districtName: Yup.string()
            .matches(/^[A-Za-z\s]+$/, "District name can only contain letters and spaces")
            .required("District name is required"),
        gst: Yup.string()
            .trim()
            .matches(
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                "GST must be a valid (27AAAPA1234A1Z5)"
            )
            .length(15, "GST must be exactly 15 characters")
            .required("GST number is required"),
        pan: Yup.string()
            .trim()
            .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN must be a valid (GWKLX9273C)")
            .length(10, "PAN must be exactly 10 characters")
            .required("PAN is required"),
        officeAdd: Yup.string()
            .trim()
            .min(5, "Office Address must be at least 5 characters")
            .required("Office Address is required"),
        companyweb: Yup.string()
            .trim()
            .url("Invalid URL"),
        incCertiBase64: Yup.string()
            .trim()
            .required("Document Required."),
        eightygCertiBase64: Yup.string()
            .trim()
            .required("Document Required."),
        csr1CertiBase64: Yup.string()
            .trim()
            .required("Document Required."),
        csrRegNo: Yup.string()
            .trim()
            .required("CSR-1 Certificate Number is required"),
        darpanRegNo: Yup.string()
            .trim()
            .required("Document Required."),
    });

// OrganizationInfo
export const sectors = [
    "Health",
    "Education",
    "Infrastructure",
    "Agriculture",
    "Energy",
    "Water & Sanitation",
    "Technology & Innovation",
    "Social Welfare",
    "Tourism & Hospitality",
    "Transport & Logistics",
    "Environment & Sustainability",
    "Skill Development",
    "Housing & Urban Development",
    "Rural Development",
    "Industrial Development",
    "Commerce & Trade",
    "Finance & Banking",
    "Public Safety & Governance",
];
export const nonCompanyOptions = [
    { value: "section", label: "Section 8" },
    { value: "society-trust", label: "Society/Trust" },
    { value: "donor-foundation", label: "Donor Foundation" },
    { value: "autonomous-body", label: 'Statutory Body', }
];

// index main file
export const FormSteps = [
    { label: 'Corporate Information', key: 'organization_info' },
    { label: 'Correspondence Info', key: 'correspondance_info' },
    { label: 'Financial Information', key: 'financial_info' },
    { label: 'CSR Funding Details', key: 'csr_funding_details' },
    { label: 'Banking Details', key: 'bank_info' },
    { label: 'Submit Form', key: 'submit_ngo_info' },
];

// CSRFundingForm

export const CSRFundingFormValidationSchema = Yup.object({
    projects: Yup.array()
        .of(
            Yup.object({
                id: Yup.number(),

                financialYear: Yup.string()
                    .required("Financial year is required")
                    .nullable(),

                projectName: Yup.string()
                    .trim()
                    .min(3, "Project name must be at least 3 characters")
                    .max(100, "Project name can't exceed 100 characters")
                    .required("Project name is required")
                    .nullable(),

                projectDescription: Yup.string()
                    .trim()
                    .min(10, "Description must be at least 10 characters")
                    .max(500, "Description can't exceed 500 characters")
                    .required("Project description is required")
                    .nullable(),

                sector: Yup.string()
                    .required("Sector is required")
                    .nullable(),

                amount: Yup.number()
                    .typeError("Amount must be a valid number")
                    .positive("Amount must be a positive number")
                    .required("Amount is required")
                    .nullable(),

                district: Yup.string()
                    .required("district is required")
                    .nullable(),

                status: Yup.string()
                    .required("Status is required")
                    .nullable(),

                donorName: Yup.string()
                    .trim()
                    .min(3, "Donor name must be at least 3 characters")
                    .max(100, "Donor name can't exceed 100 characters")
                    .required("Donor name is required")
                    .nullable(),

                concernedPerson: Yup.string()
                    .trim()
                    .required("Concerned person name is required")
                    .nullable(),

                email: Yup.string()
                    .trim()
                    .email("Invalid email")
                    .required("Email is required")
                    .nullable(),

                document: Yup.mixed()
                    .required("Document Required"),
            })
        )
        .min(1, "At least one project is required"),

    agreeTerms: Yup.boolean()
        .oneOf([true], "You must accept the terms and conditions")
        .required("You must accept the terms and conditions"),
});

// BankingDeatails 

export const BankingDeatailsValidationSchema = Yup.object().shape({
    banks: Yup.array()
        .max(3, "Only 3 banks allowed")
        .of(
            Yup.object().shape({
                id: Yup.number(),
                name: Yup.string().required("Bank name is required"),
                account: Yup.string()
                    .required("Account No. is required")
                    .matches(/^\d{9,18}$/, "Enter a valid bank account number (9-18 digits)"),
                ifsc: Yup.string()
                    .required("IFSC is required")
                    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter valid (XXXX0000222)"),
                username: Yup.string().required("Username is required")
                    .matches(/^[A-Za-z ]+$/, "Only alphabetic characters are allowed")
                    .max(50, "Username must be at most 50 characters"),
                cheque: Yup.string().trim().required('Bank Proof Required'),
                isDefault: Yup.boolean(),
            })
        )
        .test("oneDefault", "One account must be marked as default", (banks) => {
            return banks?.filter((bank) => bank.isDefault).length === 1;
        }),
});

export const getFileError = (index: number, formik: any): string | null => {
    const touched = formik.touched?.financials?.[index]?.fy_statement_file;
    const errorObj = formik.errors?.financials?.[index];

    if (
        touched &&
        errorObj !== null &&
        typeof errorObj === 'object' &&
        typeof errorObj?.fy_statement_file === 'string'
    ) {
        return errorObj.fy_statement_file;
    }

    return null;
};


export const VoluntaryFormValidationSchema = Yup.object().shape({
    full_name: Yup.string()
        .trim()
        .required("Full name is required / पूर्ण नाव आवश्यक आहे"),

    age: Yup.number()
        .required("Age is required / वय आवश्यक आहे")
        .moreThan(0, "Age must be greater than 0 / वय 0 पेक्षा जास्त असावे"),

    gender: Yup.string().required("Gender is required / लिंग आवश्यक आहे"),

    mobile: Yup.string()
        .matches(/^[6-9][0-9]{9}$/, "Mobile must be a valid 10-digit number / मोबाइल नंबर १० अंकी असावा")
        .required("Mobile number is required / मोबाइल नंबर आवश्यक आहे"),

    email: Yup.string()
        .email("Invalid email address / अवैध ईमेल पत्ता")
        .required("Email is required / ईमेल आवश्यक आहे"),

    village_id: Yup.string().notRequired(),
    taluka_id: Yup.string().notRequired(),
    district_id: Yup.string().required("District is required / जिल्हा आवश्यक आहे"),

    pin_code: Yup.string()
        .matches(/^[1-9][0-9]{5}$/, "PIN code must be 6 digits / पिन कोड ६ अंकी असावा")
        .required("PIN code is required / पिन कोड आवश्यक आहे"),
    skills: Yup.array()
        .of(Yup.string())
        .min(1, "Select at least one Area of Support / किमान एक सहाय्य क्षेत्र निवडा"),
    other_skill: Yup.string().when("skills", {
        is: (skills: string[]) => skills.includes("Other"),
        then: (schema) => schema.required("Please specify your other skill / कृपया आपले इतर कौशल्य नमूद करा"),
        otherwise: (schema) => schema.notRequired(),
    }),

    emergency_name: Yup.string().required("Emergency contact name is required / आपत्कालीन संपर्काचे नाव आवश्यक आहे"),
    emergency_relation: Yup.string().required("Emergency relation is required / आपत्कालीन नाते आवश्यक आहे"),
    emergency_mobile: Yup.string()
        .matches(/^[6-9][0-9]{9}$/, "Emergency mobile must be 10 digits / आपत्कालीन मोबाइल १० अंकी असावा")
        .required("Emergency mobile is required / आपत्कालीन मोबाइल आवश्यक आहे"),

    declaration: Yup.boolean().oneOf(
        [true],
        "You must accept the declaration / आपण घोषणापत्र स्वीकारले पाहिजे"
    ),
});