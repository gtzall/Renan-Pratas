require('dotenv').config();
const express = require('express');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.'));

// Store transactions in memory (in production, use a database)
const transactions = {};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Pix creation endpoint
app.post('/api/pix/create', async (req, res) => {
    try {
        const { amount, description } = req.body;
        
        // Validate input
        if (!amount || !description) {
            return res.status(400).json({ 
                ok: false, 
                error: 'Amount and description are required' 
            });
        }

        // Generate unique transaction ID
        const txid = 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Create Pix payload (simplified EMV QR Code format)
        const payload = `00020126580014br.gov.bcb.pix0136${txid}520400005303986540${amount}5802BR5913Renan Pratas6009Sao Paulo62070503***6304${generateCRC16(`00020126580014br.gov.bcb.pix0136${txid}520400005303986540${amount}5802BR5913Renan Pratas6009Sao Paulo62070503***6304`)}`;
        
        // Generate QR code
        const qrcodeDataUrl = await qrcode.toDataURL(payload, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        // Store transaction
        transactions[txid] = {
            status: 'pending',
            amount: parseFloat(amount),
            description,
            payload,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Simulate payment confirmation after ~15 seconds
        setTimeout(() => {
            if (transactions[txid]) {
                transactions[txid].status = 'paid';
                transactions[txid].updatedAt = new Date();
            }
        }, 15000);

        res.json({
            ok: true,
            txid,
            payload,
            qrcodeDataUrl,
            amount: parseFloat(amount),
            description,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        });

    } catch (error) {
        console.error('Error creating Pix:', error);
        res.status(500).json({ 
            ok: false, 
            error: 'Internal server error' 
        });
    }
});

// Pix status endpoint
app.get('/api/pix/status/:txid', (req, res) => {
    try {
        const { txid } = req.params;
        
        if (!transactions[txid]) {
            return res.status(404).json({ 
                ok: false, 
                error: 'Transaction not found' 
            });
        }

        res.json({
            ok: true,
            status: transactions[txid].status,
            amount: transactions[txid].amount,
            description: transactions[txid].description,
            createdAt: transactions[txid].createdAt,
            updatedAt: transactions[txid].updatedAt
        });

    } catch (error) {
        console.error('Error checking Pix status:', error);
        res.status(500).json({ 
            ok: false, 
            error: 'Internal server error' 
        });
    }
});

// Debug endpoint to see all transactions
app.get('/api/transactions', (req, res) => {
    res.json({
        ok: true,
        transactions,
        count: Object.keys(transactions).length
    });
});

// Simple CRC16 calculation for Pix
function generateCRC16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        ok: false, 
        error: 'Internal server error' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        ok: false, 
        error: 'Endpoint not found' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Renan Pratas server running on port ${PORT}`);
    console.log(`📱 WhatsApp: +55 11 97688-8011`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`💳 Pix API: http://localhost:${PORT}/api/pix/create`);
});
