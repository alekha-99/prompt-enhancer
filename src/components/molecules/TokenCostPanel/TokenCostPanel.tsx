/**
 * TokenCostPanel Component
 * Displays token count and cost estimates for different models
 */

'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Chip,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
} from '@mui/material';
import { ExpandMore, ExpandLess, Savings, AttachMoney } from '@mui/icons-material';
import { TokenEstimate, formatCost, getTierColor } from '@/core/analysis/token-estimator';

interface TokenCostPanelProps {
    estimate: TokenEstimate;
    compact?: boolean;
}

export function TokenCostPanel({ estimate, compact = false }: TokenCostPanelProps) {
    const [expanded, setExpanded] = useState(!compact);

    return (
        <Box
            sx={{
                p: 2,
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.08)',
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: 'rgba(34,197,94,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AttachMoney sx={{ color: '#22c55e' }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                            ~{estimate.tokenCount.toLocaleString()} tokens
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {estimate.recommendation}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={() => setExpanded(!expanded)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Box>

            {/* Savings highlight */}
            {estimate.savings && estimate.savings.percentSaved > 10 && (
                <Chip
                    icon={<Savings fontSize="small" />}
                    label={`Save ${estimate.savings.percentSaved}% with ${estimate.savings.model}`}
                    size="small"
                    sx={{
                        mt: 1,
                        backgroundColor: 'rgba(34,197,94,0.1)',
                        color: '#22c55e',
                        '& .MuiChip-icon': { color: '#22c55e' },
                    }}
                />
            )}

            {/* Cost breakdown */}
            <Collapse in={expanded}>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1 }}>
                        Estimated Cost by Model (input + 2x output)
                    </Typography>
                    <Table size="small">
                        <TableBody>
                            {estimate.costEstimates.slice(0, 6).map((cost) => (
                                <TableRow key={cost.model} sx={{ '& td': { borderColor: 'rgba(255,255,255,0.05)', py: 0.75, px: 1 } }}>
                                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', width: '45%' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="caption">{cost.model}</Typography>
                                            <Chip
                                                label={cost.tier}
                                                size="small"
                                                sx={{
                                                    height: 16,
                                                    fontSize: '0.6rem',
                                                    backgroundColor: `${getTierColor(cost.tier)}20`,
                                                    color: getTierColor(cost.tier),
                                                }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'rgba(255,255,255,0.5)', width: '25%' }}>
                                        <Typography variant="caption">{cost.provider}</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: getTierColor(cost.tier), width: '30%' }}>
                                        <Tooltip title={`Input: ${formatCost(cost.inputCost)} | Output: ${formatCost(cost.outputCost)}`}>
                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                {formatCost(cost.totalEstimate)}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Collapse>
        </Box>
    );
}
