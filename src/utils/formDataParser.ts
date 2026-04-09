const formDataParser = (formData: FormData) => {
    const result: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
        if (!(value instanceof File)) {
            if (result[key] && result[key] instanceof Array) {
                result[key].push(value);
            } else if (result[key]) {
                result[key] = [result[key], value] as string[];
            } else
                result[key] = value;
        }
    }
    return result;
}

export const objToFormData = (jsonData: Record<string, any>) => {
    const formData: FormData = new FormData();
    Object.entries(jsonData).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (value instanceof Array)
            value.forEach((value) => formData.append(key, value))
        else
            formData.append(key, value)
    });
    return formData;
}

export default formDataParser;