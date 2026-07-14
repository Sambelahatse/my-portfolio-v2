const sendToN8n = async (payload: object) => {
    const res = await fetch(
        'https://marasambilahy-ms-team-n8n-service.hf.space/webhook/portfolio-contact-2',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }
    );

    if (!res.ok) {
        throw new Error(`n8n failed: ${res.status}`);
    }

    return res.json();
};

const sendToWeb3Forms = async (formData: { name: string; email: string; message: string }) => {
    const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            access_key: '3135f7e1-8288-4316-85f1-4e5919cadb7e',
            name: formData.name,
            email: formData.email,
            message: formData.message,
            subject: `Nouveau message de ${formData.name} - Portfolio`,
            from_name: 'Portfolio Contact Form',
            to_email: 'marasambilahy@gmail.com',
        }),
    });

    const result = await res.json();

    if (!result.success) {
        throw new Error('Web3Forms submission failed');
    }
};

export { sendToN8n, sendToWeb3Forms };