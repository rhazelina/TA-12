import axios from "axios";

export const postData = async (values: any) => {
    try {
        const response = await axios.post("https://sertif.gedanggoreng.com/api/v1/letters/surat-tugas", values)
        return response.data
    } catch (error) {
        throw error
    }
}

export const postDataPersetujuan = async (values: any) => {
    try {
        const response = await axios.post("https://sertif.gedanggoreng.com/api/v1/letters/lembar-persetujuan", values)
        return response.data
    } catch (error) {
        throw error
    }
}

export const downloadPDF = async (nameFile: string) => {
    try {
        const response = await axios.get(`https://sertif.gedanggoreng.com/api/v1/letters/download/${nameFile}`, {
            responseType: "blob",
        })
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", nameFile)
        document.body.appendChild(link)
        link.click()
        link.remove() // Clean up
        window.URL.revokeObjectURL(url)
    } catch (error) {
        throw error
    }
}

