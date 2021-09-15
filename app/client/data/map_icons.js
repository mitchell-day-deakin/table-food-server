let mapMenuIcons = [
    {
        src: "media/mil/infantry.png",
        text: "Add Symbol",
        id: "add_symbols",
        sub: [{
            src: 'media/mil/infantry.png',
            text: "Bluefor Units",
            id: 'bluefor',
            sub: [
                {
                    text: 'Infantry',
                    id: 'infantry',
                    type: 'billboard',
                    src: 'media/mil/infantry.png',
                    sub: [
                        {
                            text: 'Infantry HQ',
                            id: "infantry_hq",
                            type: 'billboard',
                            src: 'media/mil/infantry_pl_hq.png',
                            sub: [
                                {
                                    text: 'Infantry Pl HQ',
                                    id: "infantry_pl_hq",
                                    type: 'billboard',
                                    src: 'media/mil/infantry_pl_hq.png'
                                },
                                {
                                    text: 'Infantry Company HQ',
                                    id: "infantry_comp_hq",
                                    type: 'billboard',
                                    src: 'media/mil/infantry_comp_hq.png'
                                }
                            ]
                        },
                        {
                            text: 'Motor Infantry',
                            id: "mot_inf",
                            type: 'billboard',
                            src: 'media/mil/mot_inf.png',
                            sub: [
                                {
                                    text: 'HQ',
                                    id: "mot_inf_ct",
                                    type: 'billboard',
                                    src: 'media/mil/mot_inf_ct_hq.png',
                                    sub: [
                                        {
                                            text: 'Motorized Infantry CT HQ',
                                            id: "mot_inf_ct_hq",
                                            type: 'billboard',
                                            src: 'media/mil/mot_inf_ct_hq.png'
                                        },
                                        {
                                            text: 'Motorized Infantry Battalion HQ',
                                            id: "mot_inf_bat_hq",
                                            type: 'billboard',
                                            src: 'media/mil/mot_inf_bat_hq.png'
                                        }
                                    ]
                                },
                                {
                                    text: 'Motorized Infantry Detachment',
                                    id: "mot_inf_det",
                                    type: 'billboard',
                                    src: 'media/mil/mot_inf_det.png'
                                },
                                {
                                    text: 'Motorized Infantry Squad',
                                    id: "mot_inf_squad",
                                    type: 'billboard',
                                    src: 'media/mil/mot_inf_squad.png'
                                },
                                {
                                    text: 'Motorized Infantry Sect',
                                    id: "mot_inf_sect",
                                    type: 'billboard',
                                    src: 'media/mil/mot_inf_sect.png'
                                },
                                {
                                    text: 'Motorized Infantry Pl',
                                    id: "mot_inf_pl",
                                    type: 'billboard',
                                    src: 'media/mil/mot_inf_pl.png'
                                },
                                {
                                    text: 'Motorized Infantry Company',
                                    id: "mot_inf_comp",
                                    type: 'billboard',
                                    src: 'media/mil/mot_inf_comp.png'
                                },
                                {
                                    text: 'Motorized Infantry CT',
                                    id: "mot_inf_ct",
                                    type: 'billboard',
                                    src: 'media/mil/mot_inf_ct.png'
                                },
                                {
                                    text: 'Motorized Infantry Battalion',
                                    id: "mot_inf_bat",
                                    type: 'billboard',
                                    src: 'media/mil/mot_inf_bat.png'
                                },
                                {
                                    text: 'Motorized Infantry Regiment',
                                    id: "mot_inf_reg",
                                    type: 'billboard',
                                    src: 'media/mil/mot_inf_reg.png'
                                }
                            ]
                        },
                        {
                            text: 'Mech Infantry',
                            id: "mech_inf",
                            type: 'billboard',
                            src: 'media/mil/mech_inf.png',
                            sub: [
                                {
                                    text: 'Mech Infantry Detachment',
                                    id: "mech_inf_det",
                                    type: 'billboard',
                                    src: 'media/mil/mech_inf_det.png'
                                },
                                {
                                    text: 'Mech Infantry Squad',
                                    id: "mech_inf_squad",
                                    type: 'billboard',
                                    src: 'media/mil/mech_inf_squad.png'
                                },
                                {
                                    text: 'Mech Infantry Sect',
                                    id: "mech_inf_sect",
                                    type: 'billboard',
                                    src: 'media/mil/mech_inf_sect.png'
                                },
                                {
                                    text: 'Mech Infantry Pl',
                                    id: "mech_inf_pl",
                                    type: 'billboard',
                                    src: 'media/mil/mech_inf_pl.png'
                                },
                                {
                                    text: 'Mech Infantry Company',
                                    id: "mech_inf_comp",
                                    type: 'billboard',
                                    src: 'media/mil/mech_inf_comp.png'
                                }
                            ]
                        },
                        {
                            text: 'Infantry Detachment',
                            id: 'infantry_det',
                            type: 'billboard',
                            src: 'media/mil/infantry_det.png'
                        },
                        {
                            text: 'Infantry Squad',
                            id: 'infantry_squad',
                            type: 'billboard',
                            src: 'media/mil/infantry_squad.png'
                        },
                        {
                            text: 'Infantry Section',
                            id: 'infantry_sect',
                            type: 'billboard',
                            src: 'media/mil/infantry_sect.png'
                        },
                        {
                            text: 'Infantry Pl',
                            id: 'infantry_pl',
                            type: 'billboard',
                            src: 'media/mil/infantry_pl.png'
                        },
                        {
                            text: 'Infantry Company',
                            id: 'infantry_comp',
                            type: 'billboard',
                            src: 'media/mil/infantry_comp.png'
                        },
                        {
                            text: 'Infantry CT',
                            id: 'infantry_ct',
                            type: 'billboard',
                            src: 'media/mil/infantry_ct.png'
                        },
                        {
                            text: 'Infantry Battalion',
                            id: 'infantry_bat',
                            type: 'billboard',
                            src: 'media/mil/infantry_bat.png'
                        },
                        {
                            text: 'Infantry Regiment',
                            id: 'infantry_reg',
                            type: 'billboard',
                            src: 'media/mil/infantry_reg.png'
                        }
                    ]
                },
                {
                    text: 'Eng',
                    id: "engineer",
                    type: 'billboard',
                    src: 'media/mil/engineers.png',
                    sub: [
                        {
                            text: 'Engineer Detachment',
                            id: "engineer_det",
                            type: 'billboard',
                            src: 'media/mil/eng_det.png'
                        },
                        {
                            text: 'Engineer Squad',
                            id: "engineer_squad",
                            type: 'billboard',
                            src: 'media/mil/eng_squad.png'
                        },
                        {
                            text: 'Engineer Section',
                            id: "engineer_sect",
                            type: 'billboard',
                            src: 'media/mil/eng_sect.png'
                        },
                        {
                            text: 'Engineer Pl',
                            id: "engineer_pl",
                            type: 'billboard',
                            src: 'media/mil/eng_pl.png'
                        },
                        {
                            text: 'Engineer Company',
                            id: "engineer_comp",
                            type: 'billboard',
                            src: 'media/mil/eng_comp.png'
                        }
                    ]
                },
                {
                    text: 'UAV',
                    id: "uav",
                    type: 'billboard',
                    src: 'media/mil/uav.png',
                    sub: [
                        {
                            text: 'UAV Detachment',
                            id: "uav_det",
                            type: 'billboard',
                            src: 'media/mil/uav_det.png'
                        },
                        {
                            text: 'UAV Squad',
                            id: "uav_squad",
                            type: 'billboard',
                            src: 'media/mil/uav_squad.png'
                        },
                        {
                            text: 'UAV Sect',
                            id: "uav_sect",
                            type: 'billboard',
                            src: 'media/mil/uav_sect.png'
                        },
                        {
                            text: 'UAV Pl',
                            id: "uav_pl",
                            type: 'billboard',
                            src: 'media/mil/uav_pl.png'
                        },
                        {
                            text: 'UAV Company',
                            id: "uav_comp",
                            type: 'billboard',
                            src: 'media/mil/uav_comp.png'
                        }
                    ]
                },
                {
                    text: 'Tank',
                    id: "tank",
                    type: 'billboard',
                    src: 'media/mil/tank.png',
                    sub: [
                        {
                            text: 'Tank Detachment',
                            id: "tank_det",
                            type: 'billboard',
                            src: 'media/mil/tank_det.png'
                        },
                        {
                            text: 'Tank Squad',
                            id: "tank_squad",
                            type: 'billboard',
                            src: 'media/mil/tank_squad.png'
                        },
                        {
                            text: 'Tank Section',
                            id: "tank_sect",
                            type: 'billboard',
                            src: 'media/mil/tank_sect.png'
                        },
                        {
                            text: 'Tank Pl',
                            id: "tank_pl",
                            type: 'billboard',
                            src: 'media/mil/tank_pl.png'
                        },
                        {
                            text: 'Tank Company',
                            id: "tank_comp",
                            type: 'billboard',
                            src: 'media/mil/tank_comp.png'
                        }
                    ]
                },
                {
                    text: 'Artillery',
                    id: "art",
                    type: 'billboard',
                    src: 'media/mil/art.png',
                    sub: [
                        {
                            text: 'Artillery Detachment',
                            id: "art_det",
                            type: 'billboard',
                            src: 'media/mil/art_det.png'
                        },
                        {
                            text: 'Artillery Squad',
                            id: "art_squad",
                            type: 'billboard',
                            src: 'media/mil/art_squad.png'
                        },
                        {
                            text: 'Artillery Sect',
                            id: "art_sect",
                            type: 'billboard',
                            src: 'media/mil/art_sect.png'
                        },
                        {
                            text: 'Artillery Pl',
                            id: "art_pl",
                            type: 'billboard',
                            src: 'media/mil/art_pl.png'
                        },
                        {
                            text: 'Artillery Company',
                            id: "art_comp",
                            type: 'billboard',
                            src: 'media/mil/art_comp.png'
                        }
                    ]
                },
                {
                    text: 'Mortar',
                    id: "mortar",
                    type: 'billboard',
                    src: 'media/mil/mortar.png',
                    sub: [
                        {
                            text: 'Mortar Detachment',
                            id: "mortar_det",
                            type: 'billboard',
                            src: 'media/mil/mortar_det.png'
                        },
                        {
                            text: 'Mortar Squad',
                            id: "mortar_squad",
                            type: 'billboard',
                            src: 'media/mil/mortar_squad.png'
                        },
                        {
                            text: 'Mortar Sect',
                            id: "mortar_sect",
                            type: 'billboard',
                            src: 'media/mil/mortar_sect.png'
                        },
                        {
                            text: 'Mortar Pl',
                            id: "mortar_pl",
                            type: 'billboard',
                            src: 'media/mil/mortar_pl.png'
                        },
                        {
                            text: 'Mortar Company',
                            id: "mortar_comp",
                            type: 'billboard',
                            src: 'media/mil/mortar_comp.png'
                        }
                    ]
                },
                {
                    text: 'Recon',
                    id: "recon",
                    type: 'billboard',
                    src: 'media/mil/recon.png',
                    sub: [
                        {
                            text: 'Recon Detachment',
                            id: "recon_det",
                            type: 'billboard',
                            src: 'media/mil/recon_det.png'
                        },
                        {
                            text: 'Recon Squad',
                            id: "recon_squad",
                            type: 'billboard',
                            src: 'media/mil/recon_squad.png'
                        },
                        {
                            text: 'UAV Sect',
                            id: "recon_sect",
                            type: 'billboard',
                            src: 'media/mil/recon_sect.png'
                        },
                        {
                            text: 'Recon Pl',
                            id: "recon_pl",
                            type: 'billboard',
                            src: 'media/mil/recon_pl.png'
                        },
                        {
                            text: 'Recon Company',
                            id: "recon_comp",
                            type: 'billboard',
                            src: 'media/mil/recon_comp.png'
                        }
                    ]
                },
                {
                    text: 'Medical',
                    id: "med",
                    type: 'billboard',
                    src: 'media/mil/med.png',
                    sub: [
                        {
                            text: 'Medical Detachment',
                            id: "med_det",
                            type: 'billboard',
                            src: 'media/mil/med_det.png'
                        },
                        {
                            text: 'Medical Squad',
                            id: "med_squad",
                            type: 'billboard',
                            src: 'media/mil/med_squad.png'
                        },
                        {
                            text: 'Medical Sect',
                            id: "med_sect",
                            type: 'billboard',
                            src: 'media/mil/med_sect.png'
                        },
                        {
                            text: 'Medical Pl',
                            id: "med_pl",
                            type: 'billboard',
                            src: 'media/mil/med_pl.png'
                        },
                        {
                            text: 'Medical Company',
                            id: "med_comp",
                            type: 'billboard',
                            src: 'media/mil/med_comp.png'
                        }
                    ]
                },
                {
                    text: 'Log',
                    id: "log",
                    type: 'billboard',
                    src: 'media/mil/log_pl.png',
                    sub: [
                        {
                            text: 'Log Detachment',
                            id: "log_det",
                            type: 'billboard',
                            src: 'media/mil/log_det.png'
                        },
                        {
                            text: 'Log Squad',
                            id: "log_squad",
                            type: 'billboard',
                            src: 'media/mil/log_squad.png'
                        },
                        {
                            text: 'Log Section',
                            id: "log_sect",
                            type: 'billboard',
                            src: 'media/mil/log_sect.png'
                        },
                        {
                            text: 'Log Pl',
                            id: "log_pl",
                            type: 'billboard',
                            src: 'media/mil/log_pl.png'
                        },
                        {
                            text: 'Log Company',
                            id: "log_comp",
                            type: 'billboard',
                            src: 'media/mil/log_comp.png'
                        },
                        {
                            text: 'Log CT',
                            id: "log_ct",
                            type: 'billboard',
                            src: 'media/mil/log_ct.png'
                        },
                        {
                            text: 'Log Battalion',
                            id: "log_bat",
                            type: 'billboard',
                            src: 'media/mil/log_bat.png'
                        },
                        {
                            text: 'Log Regiment',
                            id: "log_reg",
                            type: 'billboard',
                            src: 'media/mil/log_reg.png'
                        }
                    ]
                }
            ]
        },
        {
            src: 'media/mil/opfor.png',
            text: 'EN Units',
            id: 'en_inf',
            sub: [
                {
                    text: 'Infantry',
                    id: "en_infantry",
                    type: 'billboard',
                    src: 'media/mil/en_inf.png',
                    sub: [
                        {
                            text: 'Infantry HQ',
                            id: "en_inf_hq",
                            type: 'billboard',
                            src: 'media/mil/en_inf_hq.png',
                            sub: [
                                {
                                    text: 'Infantry Pl HQ',
                                    id: "en_inf_pl_hq",
                                    type: 'billboard',
                                    src: 'media/mil/en_inf_pl_hq.png'
                                },
                                {
                                    text: 'Infantry Company HQ',
                                    id: "en_inf_comp_hq",
                                    type: 'billboard',
                                    src: 'media/mil/en_inf_comp_hq.png'
                                }
                            ]
                        },
                        {
                            text: 'Mech Infantry',
                            id: "en_mech_inf",
                            type: 'billboard',
                            src: 'media/mil/en_mech_inf.png',
                            sub: [
                                {
                                    text: 'Mech Infantry Detachment',
                                    id: "en_mech_inf_det",
                                    type: 'billboard',
                                    src: 'media/mil/en_mech_inf_det.png'
                                },
                                {
                                    text: 'Mech Infantry Section',
                                    id: "en_mech_inf_sect",
                                    type: 'billboard',
                                    src: 'media/mil/en_mech_inf_sect.png'
                                },
                                {
                                    text: 'Mech Infantry Pl',
                                    id: "en_mech_inf_pl",
                                    type: 'billboard',
                                    src: 'media/mil/en_mech_inf_pl.png'
                                },
                                {
                                    text: 'Mech Infantry Company',
                                    id: "en_mech_inf_comp",
                                    type: 'billboard',
                                    src: 'media/mil/en_mech_inf_comp.png'
                                }
                            ]
                        },
                        {
                            text: 'Infantry Detachment',
                            id: "en_inf_det",
                            type: 'billboard',
                            src: 'media/mil/en_inf_det.png'
                        },
                        {
                            text: 'Infantry Squad',
                            id: "en_inf_squad",
                            type: 'billboard',
                            src: 'media/mil/en_inf_squad.png'
                        },
                        {
                            text: 'Infantry Pl',
                            id: "en_inf_pl",
                            type: 'billboard',
                            src: 'media/mil/en_inf_pl.png'
                        },
                        {
                            text: 'Infantry Company',
                            id: "en_inf_comp",
                            type: 'billboard',
                            src: 'media/mil/en_inf_comp.png'
                        }
                    ]
                },
                {
                    text: 'Anti Armour',
                    id: "en_anti_armour",
                    type: 'billboard',
                    src: 'media/mil/en_anti_armour_sect.png',
                    sub: [
                        {
                            text: 'Anti Armour Det',
                            id: "en_anti_armour_det",
                            type: 'billboard',
                            src: 'media/mil/en_anti_armour_det.png'
                        },
                        {
                            text: 'Anti Armour Sect',
                            id: "en_anti_armour_sect",
                            type: 'billboard',
                            src: 'media/mil/en_anti_armour_sect.png'
                        },
                        {
                            text: 'Anti Armour Pl',
                            id: "en_anti_armour_pl",
                            type: 'billboard',
                            src: 'media/mil/en_anti_armour_pl.png'
                        },
                        {
                            text: 'Anti Armour Comp',
                            id: "en_anti_armour_comp",
                            type: 'billboard',
                            src: 'media/mil/en_anti_armour_comp.png'
                        }
                    ]
                },
                {
                    text: 'Anti Tank',
                    id: "en_tank_missile",
                    type: 'billboard',
                    src: 'media/mil/en_anti_tank_mis_med_sect.png',
                    sub: [
                        {
                            text: 'Missile',
                            id: "en_anti_tank_mis",
                            type: 'billboard',
                            src: 'media/mil/en_anti_tank_mis_med_sect.png',
                            sub: [
                                {
                                    text: 'Light',
                                    id: "en_anti_tank_mis_light",
                                    type: 'billboard',
                                    src: 'media/mil/en_anti_tank_mis_light_sect.png',
                                    sub: [
                                        {
                                            text: 'Anti Tank Missile Det - Light',
                                            id: "en_anti_tank_mis_light_det",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_light_det.png'
                                        },
                                        {
                                            text: 'Anti Tank Missile Sect - Light',
                                            id: "en_anti_tank_mis_light_sect",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_light_sect.png'
                                        },
                                        {
                                            text: 'Anti Tank Missile Pl - Light',
                                            id: "en_anti_tank_mis_light_pl",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_light_pl.png'
                                        },
                                        {
                                            text: 'Anti Tank Missile Company - Light',
                                            id: "en_anti_tank_mis_light_comp",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_light_comp.png'
                                        }
                                    ]
                                },
                                {
                                    text: 'Medium',
                                    id: "en_anti_tank_mis_med",
                                    type: 'billboard',
                                    src: 'media/mil/en_anti_tank_mis_med_sect.png',
                                    sub: [
                                        {
                                            text: 'Anti Tank Missile Det - Medium',
                                            id: "en_anti_tank_mis_med_det",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_med_det.png'
                                        },
                                        {
                                            text: 'Anti Tank Missile Sect - Medium',
                                            id: "en_anti_tank_mis_med_sect",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_med_sect.png'
                                        },
                                        {
                                            text: 'Anti Tank Missile Pl - Medium',
                                            id: "en_anti_tank_mis_med_pl",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_med_pl.png'
                                        },
                                        {
                                            text: 'Anti Tank Missile Company - Medium',
                                            id: "en_anti_tank_mis_med_comp",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_med_comp.png'
                                        }
                                    ]
                                },
                                {
                                    text: 'Heavy',
                                    id: "en_anti_tank_mis_heavy",
                                    type: 'billboard',
                                    src: 'media/mil/en_anti_tank_mis_heavy_sect.png',
                                    sub: [
                                        {
                                            text: 'Anti Tank Missile Det - Heavy',
                                            id: "en_anti_tank_mis_heavy_det",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_heavy_det.png'
                                        },
                                        {
                                            text: 'Anti Tank Missile Sect - Heavy',
                                            id: "en_anti_tank_mis_heavy_sect",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_heavy_sect.png'
                                        },
                                        {
                                            text: 'Anti Tank Missile Pl - Heavy',
                                            id: "en_anti_tank_mis_heavy_pl",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_heavy_pl.png'
                                        },
                                        {
                                            text: 'Anti Tank Missile Company - Heavy',
                                            id: "en_anti_tank_mis_heavy_comp",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_mis_heavy_comp.png'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            text: 'Rocket',
                            id: "en_anti_tank_rock",
                            type: 'billboard',
                            src: 'media/mil/en_anti_tank_rocket_light_sect.png',
                            sub: [
                                {
                                    text: 'Light',
                                    id: "en_anti_tank_rocket_light",
                                    type: 'billboard',
                                    src: 'media/mil/en_anti_tank_rocket_light_sect.png',
                                    sub: [
                                        {
                                            text: 'Anti Tank Rocket Det - Light',
                                            id: "en_anti_tank_rocket_light_det",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_light_det.png'
                                        },
                                        {
                                            text: 'Anti Tank Rocket Sect - Light',
                                            id: "en_anti_tank_rocket_light_sect",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_light_sect.png'
                                        },
                                        {
                                            text: 'Anti Tank Rocket Pl - Light',
                                            id: "en_anti_tank_rocket_light_pl",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_light_pl.png'
                                        },
                                        {
                                            text: 'Anti Tank Rocket Company - Light',
                                            id: "en_anti_tank_rocket_light_comp",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_light_comp.png'
                                        }
                                    ]
                                },
                                {
                                    text: 'Medium',
                                    id: "en_anti_tank_rocket_med",
                                    type: 'billboard',
                                    src: 'media/mil/en_anti_tank_rocket_med_sect.png',
                                    sub: [
                                        {
                                            text: 'Anti Tank Rocket Det - Medium',
                                            id: "en_anti_tank_rocket_med_det",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_med_det.png'
                                        },
                                        {
                                            text: 'Anti Tank Rocket Sect - Medium',
                                            id: "en_anti_tank_rocket_med_sect",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_med_sect.png'
                                        },
                                        {
                                            text: 'Anti Tank Rocket Pl - Medium',
                                            id: "en_anti_tank_rocket_med_pl",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_med_pl.png'
                                        },
                                        {
                                            text: 'Anti Tank Rocket Company - Medium',
                                            id: "en_anti_tank_rocket_med_comp",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_med_comp.png'
                                        }
                                    ]
                                },
                                {
                                    text: 'Heavy',
                                    id: "en_anti_tank_rocket_heavy",
                                    type: 'billboard',
                                    src: 'media/mil/en_anti_tank_rocket_heavy_sect.png',
                                    sub: [
                                        {
                                            text: 'Anti Tank Rocket Det - Heavy',
                                            id: "en_anti_tank_rocket_heavy_det",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_heavy_det.png'
                                        },
                                        {
                                            text: 'Anti Tank Rocket Sect - Heavy',
                                            id: "en_anti_tank_rocket_heavy_sect",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_heavy_sect.png'
                                        },
                                        {
                                            text: 'Anti Tank Rocket Pl - Heavy',
                                            id: "en_anti_tank_rocket_heavy_pl",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_heavy_pl.png'
                                        },
                                        {
                                            text: 'Anti Tank Rocket Company - Heavy',
                                            id: "en_anti_tank_rocket_heavy_comp",
                                            type: 'billboard',
                                            src: 'media/mil/en_anti_tank_rocket_heavy_comp.png'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    text: 'Mortars',
                    id: "en_mortars",
                    type: 'billboard',
                    src: 'media/mil/en_mortars_light_sect.png',
                    sub: [
                        {
                            text: 'Light',
                            id: "en_mortars_light",
                            type: 'billboard',
                            src: 'media/mil/en_mortars_light_sect.png',
                            sub: [
                                {
                                    text: 'Mortars Det - Light',
                                    id: "en_mortars_light_det",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_light_det.png'
                                },
                                {
                                    text: 'Mortars Sect - Light',
                                    id: "en_mortars_light_sect",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_light_sect.png'
                                },
                                {
                                    text: 'Mortars Pl - Light',
                                    id: "en_mortars_light_pl",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_light_pl.png'
                                },
                                {
                                    text: 'Mortars Company - Light',
                                    id: "en_mortars_light_comp",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_light_comp.png'
                                }
                            ]
                        },
                        {
                            text: 'Medium',
                            id: "en_mortars_med",
                            type: 'billboard',
                            src: 'media/mil/en_mortars_med_sect.png',
                            sub: [
                                {
                                    text: 'Mortars Det - Medium',
                                    id: "en_mortars_med_det",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_med_det.png'
                                },
                                {
                                    text: 'Mortars Sect - Medium',
                                    id: "en_mortars_med_sect",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_med_sect.png'
                                },
                                {
                                    text: 'Mortars Pl - Medium',
                                    id: "en_mortars_med_pl",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_med_pl.png'
                                },
                                {
                                    text: 'Mortars Company - Medium',
                                    id: "en_mortars_med_comp",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_med_comp.png'
                                }
                            ]
                        },
                        {
                            text: 'Heavy',
                            id: "en_mortars_heavy",
                            type: 'billboard',
                            src: 'media/mil/en_mortars_heavy_sect.png',
                            sub: [
                                {
                                    text: 'Mortars Det - Heavy',
                                    id: "en_mortars_heavy_det",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_heavy_det.png'
                                },
                                {
                                    text: 'Mortars Sect - Heavy',
                                    id: "en_mortars_heavy_sect",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_heavy_sect.png'
                                },
                                {
                                    text: 'Mortars Pl - Heavy',
                                    id: "en_mortars_heavy_pl",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_heavy_pl.png'
                                },
                                {
                                    text: 'Mortars Company - Heavy',
                                    id: "en_mortars_heavy_comp",
                                    type: 'billboard',
                                    src: 'media/mil/en_mortars_heavy_comp.png'
                                }
                            ]
                        }
                    ]
                },
                {
                    text: 'Vehicles',
                    id: "en_vehicles",
                    type: 'billboard',
                    src: 'media/mil/en_apc_sect.png',
                    sub: [
                        {
                            text: 'APC',
                            id: "en_apc",
                            type: 'billboard',
                            src: 'media/mil/en_apc_sect.png',
                            sub: [
                                {
                                    text: 'APC Det',
                                    id: "en_afc_det",
                                    type: 'billboard',
                                    src: 'media/mil/en_apc_det.png'
                                },
                                {
                                    text: 'APC Sect',
                                    id: "en_afc_sect",
                                    type: 'billboard',
                                    src: 'media/mil/en_apc_sect.png'
                                },
                                {
                                    text: 'APC Pl',
                                    id: "en_afc_pl",
                                    type: 'billboard',
                                    src: 'media/mil/en_apc_pl.png'
                                },
                                {
                                    text: 'APC Company',
                                    id: "en_afc_comp",
                                    type: 'billboard',
                                    src: 'media/mil/en_apc_comp.png'
                                }
                            ]
                        },
                        {
                            text: 'APV',
                            id: "en_apv",
                            type: 'billboard',
                            src: 'media/mil/en_apv_sect.png',
                            sub: [
                                {
                                    text: 'APV Det',
                                    id: "en_apv_det",
                                    type: 'billboard',
                                    src: 'media/mil/en_apv_det.png'
                                },
                                {
                                    text: 'APV Sect',
                                    id: "en_apv_sect",
                                    type: 'billboard',
                                    src: 'media/mil/en_apv_sect.png'
                                },
                                {
                                    text: 'APV Pl',
                                    id: "en_apv_pl",
                                    type: 'billboard',
                                    src: 'media/mil/en_apv_pl.png'
                                },
                                {
                                    text: 'APV Company',
                                    id: "en_apv_comp",
                                    type: 'billboard',
                                    src: 'media/mil/en_apv_comp.png'
                                }
                            ]
                        },
                        {
                            text: 'AFV',
                            id: "en_afv",
                            type: 'billboard',
                            src: 'media/mil/en_afv_sect.png',
                            sub: [
                                {
                                    text: 'AFV Det',
                                    id: "en_afv_det",
                                    type: 'billboard',
                                    src: 'media/mil/en_afv_det.png'
                                },
                                {
                                    text: 'AFV Sect',
                                    id: "en_afv_sect",
                                    type: 'billboard',
                                    src: 'media/mil/en_afv_sect.png'
                                },
                                {
                                    text: 'AFV Pl',
                                    id: "en_afv_pl",
                                    type: 'billboard',
                                    src: 'media/mil/en_afv_pl.png'
                                },
                                {
                                    text: 'AFV Company',
                                    id: "en_afv_comp",
                                    type: 'billboard',
                                    src: 'media/mil/en_afv_comp.png'
                                }
                            ]
                        },
                        ,
                        {
                            text: 'Tank',
                            id: "en_tank",
                            type: 'billboard',
                            src: 'media/mil/en_tank_sect.png',
                            sub: [{
                                text: 'Tank Det',
                                id: "en_tank_det",
                                type: 'billboard',
                                src: 'media/mil/en_tank_det.png'
                            },
                            {
                                text: 'Tank Sect',
                                id: "en_tank_sect",
                                type: 'billboard',
                                src: 'media/mil/en_tank_sect.png'
                            },
                            {
                                text: 'Tank Pl',
                                id: "en_tank_pl",
                                type: 'billboard',
                                src: 'media/mil/en_tank_pl.png'
                            },
                            {
                                text: 'Tank Company',
                                id: "en_tank_comp",
                                type: 'billboard',
                                src: 'media/mil/en_tank_comp.png'
                            }]
                        }
                    ]
                },
                {
                    text: 'Weapons',
                    id: "en_weapons",
                    type: 'billboard',
                    src: 'media/mil/en_med_weap_det.png',
                    sub: [
                        {
                            text: 'Medium Weapons Det',
                            id: "en_med_weap_det",
                            type: 'billboard',
                            src: 'media/mil/en_med_weap_det.png'
                        },
                        {
                            text: 'Medium Weapons Squad',
                            id: "en_med_weap_squad",
                            type: 'billboard',
                            src: 'media/mil/en_med_weap_squad.png'
                        },
                        {
                            text: 'Anti-Tank Squad',
                            id: "en_antitank_squad",
                            type: 'billboard',
                            src: 'media/mil/en_antitank_squad.png'
                        }
                    ]
                }
            ]
        },
        {
            src: 'media/mil/abf.png',
            text: "Tasks",
            id: "tasks",
            sub: [
                {
                    src: 'media/mil/blue_abf.png',
                    text: "Bluefor Tasks",
                    id: "blue_tasks",
                    sub: [
                        {
                            src: 'media/mil/blue_abf.png',
                            text: "ABF",
                            id: "blue_abf",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_abf_antic.png',
                            text: "ABF - Anticipated",
                            id: "blue_abf_antic",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_sbf.png',
                            text: "SBF",
                            id: "blue_sbf",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_sbf_antic.png',
                            text: "SBF - Anticipated",
                            id: "blue_sbf_antic",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_ambush.png',
                            text: "Ambush",
                            id: "blue_ambush",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_disrupt.png',
                            text: "Disrupt",
                            id: "blue_disrupt",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_breach.png',
                            text: "Breach",
                            id: "blue_breach",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_main.png',
                            text: "Main Attack",
                            id: "blue_main",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_attack_head.png',
                            text: "Main Attack",
                            id: "blue_attack_head",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_aoam.png',
                            text: "Axis of Attack - Main",
                            id: "blue_aoam",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_aoas.png',
                            text: "Axis of Attack - Support",
                            id: "blue_aoas",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_penetrate.png',
                            text: "Penetrate",
                            id: "blue_penetrate",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_destroy.png',
                            text: "Destroy",
                            id: "blue_destroy",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_defeat.png',
                            text: "Defeat",
                            id: "blue_defeat",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_man_corr.png',
                            text: "Manouevre Corridor",
                            id: "blue_man_corr",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_clear.png',
                            text: "Clear",
                            id: "blue_clear",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_clear_antic.png',
                            text: "Clear - Anticipated",
                            id: "blue_clear_antic",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_delay.png',
                            text: "Delay",
                            id: "blue_delay",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_retain.png',
                            text: "Retain",
                            id: "blue_retain",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_isolate.png',
                            text: "Isolate",
                            id: "blue_isolate",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_contain.png',
                            text: "Contain",
                            id: "blue_contain",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_secure.png',
                            text: "Secure",
                            id: "blue_secure",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_occupy.png',
                            text: "Occupy",
                            id: "blue_occupy",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_retain_sq.png',
                            text: "Retain",
                            id: "blue_retain_sq",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_fup.png',
                            text: "FUP",
                            id: "blue_fup",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_screen.png',
                            text: "Screen",
                            id: "blue_screen",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_cover.png',
                            text: "Cover",
                            id: "blue_cover",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_guard.png',
                            text: "Guard",
                            id: "blue_guard",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_turn_l.png',
                            text: "Turn - Left",
                            id: "blue_turn_l",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_turn_r.png',
                            text: "Turn - Right",
                            id: "blue_turn_r",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_air_assualt_r.png',
                            text: "Air Assualt - Right",
                            id: "blue_air_assualt_r",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_air_assualt_l.png',
                            text: "Air Assualt - Left",
                            id: "blue_air_assualt_l",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/op.png',
                            text: "OP",
                            id: "op",
                            type: "rectangle"
                        }
                    ]
                },
                {
                    src: 'media/mil/en_abf.png',
                    text: "En Tasks",
                    id: "en_tasks",
                    sub: [
                        {
                            src: 'media/mil/en_abf.png',
                            text: "ABF",
                            id: "en_abf",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_abf_antic.png',
                            text: "ABF - Anticipated",
                            id: "en_abf_antic",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_sbf.png',
                            text: "SBF",
                            id: "en_sbf",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_sbf_antic.png',
                            text: "SBF - Anticipated",
                            id: "en_sbf_antic",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_ambush.png',
                            text: "Ambush",
                            id: "en_ambush",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_disrupt.png',
                            text: "Disrupt",
                            id: "en_disrupt",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_breach.png',
                            text: "Breach",
                            id: "en_breach",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_main.png',
                            text: "Main Attack",
                            id: "en_main",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_attack_head.png',
                            text: "Main Attack",
                            id: "en_attack_head",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_aoam.png',
                            text: "Axis of Attack - Main",
                            id: "en_aoam",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_aoas.png',
                            text: "Axis of Attack - Support",
                            id: "en_aoas",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_penetrate.png',
                            text: "Penetrate",
                            id: "en_penetrate",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_destroy.png',
                            text: "Destroy",
                            id: "en_destroy",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_defeat.png',
                            text: "Defeat",
                            id: "en_defeat",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_man_corr.png',
                            text: "Manouevre Corridor",
                            id: "en_man_corr",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_clear.png',
                            text: "Clear",
                            id: "en_clear",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_clear_antic.png',
                            text: "Clear - Anticipated",
                            id: "en_clear_antic",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_delay.png',
                            text: "Delay",
                            id: "en_delay",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_retain.png',
                            text: "Retain",
                            id: "en_retain",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_isolate.png',
                            text: "Isolate",
                            id: "en_isolate",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_contain.png',
                            text: "Contain",
                            id: "en_contain",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_secure.png',
                            text: "Secure",
                            id: "en_secure",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_occupy.png',
                            text: "Occupy",
                            id: "en_occupy",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_fup.png',
                            text: "FUP",
                            id: "en_fup",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_screen.png',
                            text: "Screen",
                            id: "en_screen",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_cover.png',
                            text: "Cover",
                            id: "en_cover",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_guard.png',
                            text: "Guard",
                            id: "en_guard",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_turn_l.png',
                            text: "Turn - Left",
                            id: "en_turn_l",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_turn_r.png',
                            text: "Turn - Right",
                            id: "en_turn_r",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_air_assualt_r.png',
                            text: "Air Assualt - Right",
                            id: "en_air_assualt_r",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_air_assualt_l.png',
                            text: "Air Assualt - Left",
                            id: "en_air_assualt_l",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_op.png',
                            text: "OP",
                            id: "en_op",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_retain_sq.png',
                            text: "Retain",
                            id: "en_retain_sq",
                            type: "rectangle"
                        }
                    ]
                },
                {
                    src: 'media/mil/abf.png',
                    text: "ABF",
                    id: "abf",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/sbf.png',
                    text: "SBF",
                    id: "sbf",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/ambush.png',
                    text: "Ambush",
                    id: "ambush",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/main.png',
                    text: "Main Attack",
                    id: "main",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/attack_head.png',
                    text: "Main Attack",
                    id: "attack_head",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/penetrate.png',
                    text: "Penetrate",
                    id: "penetrate",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/clear.png',
                    text: "Clear",
                    id: "clear",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/bypass.png',
                    text: "Bypass",
                    id: "bypass",
                    type: "rectangle"
                }
            ]
        },
        {
            src: 'media/mil/minefield.png',
            text: "Obstacle Constrn",
            id: "obst_constr",
            sub: [
                {
                    src: 'media/mil/minefield.png',
                    text: "MINES",
                    id: "mines",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/green_wire_cat1.png',
                    text: "Wire CAT 1",
                    id: "green_wire_cat1",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/green_wire_cat2.png',
                    text: "Wire CAT 2",
                    id: "green_wire_cat2",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/green_wire_cat3.png',
                    text: "Wire CAT 3",
                    id: "green_wire_cat3",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/green_tetraline.png',
                    text: "Tetrahedron Line",
                    id: "green_tetraline",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/turn_l.png',
                    text: "Turn (Left)",
                    id: "turn_l",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/turn_r.png',
                    text: "Turn (Right)",
                    id: "turn_r",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/block.png',
                    text: "Block",
                    id: "block",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/disrupt.png',
                    text: "Disrupt",
                    id: "disrupt",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/green_tetra.png',
                    text: "Tetrahedron",
                    id: "green_tetra",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/green_tetra_mov.png',
                    text: "Tetrahedron Movable",
                    id: "green_tetra",
                    type: "rectangle"
                }
            ]
        },
        {
            src: 'media/mil/obj.png',
            text: "Markers",
            id: 'markers',
            sub: [
                {
                    src: 'media/mil/blue_ge_pl.png',
                    text: "Goose Eggs",
                    id: "goose_eggs",
                    sub: [
                        {
                            src: 'media/mil/blue_ge_sect.png',
                            text: "Solid",
                            id: "ge_solid",
                            sub: [
                                {
                                    src: 'media/mil/blue_ge_sect.png',
                                    text: "Section",
                                    id: "blue_ge_sect",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/blue_ge_pl.png',
                                    text: "Pl",
                                    id: "blue_ge_pl",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/blue_ge_comp.png',
                                    text: "Company",
                                    id: "blue_ge_comp",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/blue_ge_bat.png',
                                    text: "Battalion",
                                    id: "blue_ge_bat",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/en_ge_sect.png',
                                    text: "Section",
                                    id: "en_ge_sect",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/en_ge_pl.png',
                                    text: "Pl",
                                    id: "en_ge_pl",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/en_ge_comp.png',
                                    text: "Company",
                                    id: "en_ge_comp",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/en_ge_bat.png',
                                    text: "Battalion",
                                    id: "en_ge_bat",
                                    type: "rectangle"
                                }
                            ]
                        },
                        {
                            src: 'media/mil/blue_ge_dash_sect.png',
                            text: "Dashed",
                            id: "ge_dash",
                            sub: [
                                {
                                    src: 'media/mil/blue_ge_dash_sect.png',
                                    text: "Section",
                                    id: "blue_ge_dash_sect",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/blue_ge_dash_pl.png',
                                    text: "Pl",
                                    id: "blue_ge_dash_pl",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/blue_ge_dash_comp.png',
                                    text: "Company",
                                    id: "blue_ge_dash_comp",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/blue_ge_dash_bat.png',
                                    text: "Battalion",
                                    id: "blue_ge_dash_bat",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/en_ge_dash_sect.png',
                                    text: "Section",
                                    id: "en_ge_dash_sect",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/en_ge_dash_pl.png',
                                    text: "Pl",
                                    id: "en_ge_dash_pl",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/en_ge_dash_comp.png',
                                    text: "Company",
                                    id: "en_ge_dash_comp",
                                    type: "rectangle"
                                },
                                {
                                    src: 'media/mil/en_ge_dash_bat.png',
                                    text: "Battalion",
                                    id: "en_ge_dash_bat",
                                    type: "rectangle"
                                }
                            ]
                        }
                    ]
                },
                {
                    src: 'media/mil/aoi.png',
                    text: "AOIs",
                    id: "aoi_group",
                    sub: [
                        {
                            src: 'media/mil/aoi.png',
                            text: "Area Of Interest",
                            id: "aoi",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_aoi.png',
                            text: "Area Of Interest",
                            id: "blue_aoi",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_aoi.png',
                            text: "Area Of Interest",
                            id: "en_aoi",
                            type: "rectangle"
                        }
                    ]
                },
                {
                    src: 'media/mil/obj.png',
                    text: "OBJs",
                    id: "obj",
                    sub: [
                        {
                            src: 'media/mil/obj.png',
                            text: "Objectives",
                            id: "obj",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/bluefor_obj.png',
                            text: "Objective",
                            id: "bluefor_obj",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_obj.png',
                            text: "Objective",
                            id: "en_obj",
                            type: "rectangle"
                        }
                    ]
                },
                {
                    src: 'media/mil/aa.png',
                    text: "AAs",
                    id: "aa_group",
                    sub: [
                        {
                            src: 'media/mil/aa.png',
                            text: "AA",
                            id: "aa",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_aa.png',
                            text: "AA",
                            id: "blue_aa",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_aa_antic.png',
                            text: "AA - Anticipated",
                            id: "blue_aa_antic",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_aa.png',
                            text: "AA",
                            id: "en_aa",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_aa_antic.png',
                            text: "AA - Anticipated",
                            id: "en_aa_antic",
                            type: "rectangle"
                        }
                    ]
                },
                {
                    src: 'media/mil/blue_coord_ccp.png',
                    text: "COORDS",
                    id: "coords",
                    sub: [
                        {
                            src: 'media/mil/blue_coord_ccp.png',
                            text: "CCP",
                            id: "blue_coord_ccp",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_coord_axp.png',
                            text: "AXP",
                            id: "blue_coord_axp",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_coord_ecp.png',
                            text: "ECP",
                            id: "blue_coord_ecp",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_coord_ccp.png',
                            text: "CCP",
                            id: "en_coord_ccp",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_coord_axp.png',
                            text: "AXP",
                            id: "en_coord_axp",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/en_coord_ecp.png',
                            text: "ECP",
                            id: "en_coord_ecp",
                            type: "rectangle"
                        }
                    ]
                },
                {
                    src: 'media/mil/bat.png',
                    text: "Boundary Markers",
                    id: 'bat',
                    sub: [
                        {
                            src: 'media/mil/bat.png',
                            text: "Battalion",
                            id: "bat",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/comp.png',
                            text: "Company",
                            id: "comp",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/pl.png',
                            text: "Platoon",
                            id: "pl",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/sect.png',
                            text: "Section",
                            id: "sect",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_bat.png',
                            text: "Battalion",
                            id: "blue_bat",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/blue_comp.png',
                            text: "Company",
                            id: "blue_comp",
                            type: "rectangle"
                        },
                        {
                            src: 'media/mil/eny.png',
                            text: "ENY",
                            id: "eny",
                            type: "rectangle"
                        }
                    ]
                },
                {
                    src: 'media/mil/target.png',
                    text: "TgT",
                    id: "target",
                    type: "rectangle"
                },
                {
                    src: 'media/mil/poi.png',
                    text: "Point Of Interest",
                    id: "poi",
                    type: "rectangle"
                }
            ]
        }]
    }

]

function mergeImages(src1, src2) {
    let can = document.createElement('canvas');
    can.width = 50;
    can.height = 50;
    let ctx = can.getContext('2d');
    let img1 = new Image();
    let img2 = new Image();
    img1.src = src1;
    img2.src = src2;
    //ctx.drawImage(img1, 0, 0, 50, 50)
    //ctx.drawImage(img2, 0, 0, 50, 50);
    ctx.drawImage(img1, 0, 0)
    ctx.drawImage(img2, 0, 0);
    let img = can.toDataURL("image/png");
    return img
}

function addMapMenus() {
    let cont = document.getElementById('tewtMapPage');
    let mainId = 'mapItems';

    let createParentIcon = (icon) => {
        let src = icon.src;
        let div = document.createElement('div');
        //div.setAttribute("style", `background-image: url("./${icon.src}")`)
        if (icon.srcTwo) {
            src = mergeImages(icon.src, icon.srcTwo)
        }

        div.setAttribute('class', 'mapMenuIcon');
        div.setAttribute('style', `background-size: 85% 100%; background-color: rgba(177,177,177,.9); background-image: url("${src}")`)
        div.setAttribute("onclick", `openMapMenu('${icon.id}')`);
        //let img = `<img draggable="false" src="./media/darrow.svg" alt="${icon.text}"/>`
        let title = `<p>${icon.text.replace(" ", "<br>")}</p>`
        div.innerHTML = title//+img;
        return div;
    }

    let createDragIcon = (icon) => {
        let src = icon.src;
        let div = document.createElement('div');
        div.setAttribute('class', 'mapMenuIcon');
        let img = `<img class="dragImg" type="${icon.type}" ondragstart="dragStart(event)"`;
        if (icon.srcTwo) {
            src = mergeImages(icon.src, icon.srcTwo)
        }
        img += `draggable="true" src="${src}" alt="${icon.text}"/>`;
        div.innerHTML = img;

        return div
    }

    let createLineAndRulerIcon = () => {
        let text = `<div class="mapMenuIcon"><img class="dragImg" type="text" ondragstart="dragStart(event)"
        draggable="true" src="media/mil/text.png" alt="Text"></div>`
        text += `<div class="mapMenuIcon" onclick="mapEntities.Line.start()">
                    <img draggable="false" value="MV" src="media/mil/arrow.png" alt="Arrow">
                    </div>`;
        text += `<div class="mapMenuIcon" onclick="mapEntities.Area.start()">
                    <img draggable="false" value="MV" src="media/mil/area.png" alt="Area">
                    </div>`
        text += `<div class="mapMenuIcon" onclick="mapEntities.Ruler.start()">
                <img draggable="false" value="EN" src="media/mil/ruler.png" alt="ruler">
                </div>`
        text += `<div class="mapMenuIcon" onclick="map.resetCameraOrientation()">
                <img draggable="false" value="EN" src="media/north.png" alt="North">
                </div>`
        text += `<div class="mapMenuIcon" onclick="mapEntities.saveEntitiesToStorage()"><img src="media/save.png" alt="SAVE"></div>`;

        return text;
    }


    let createMenu = async (parentId, menuId, menuText, iconArray) => {
        let div = document.createElement('div');
        div.id = menuId;
        div.setAttribute('class', 'mapMenus');
        cont.appendChild(div);
        let title = document.createElement('div');
        title.setAttribute('class', 'mapMenuIconTitle');
        title.innerHTML = `<p>${menuText.replace(" ", "<br>")}</p>`;
        div.appendChild(title);
        if (parentId) {
            let back = document.createElement('div');
            back.setAttribute('class', 'mapMenuIcon');
            back.setAttribute('onclick', `openMapMenu('${parentId}')`);
            back.innerHTML = `<img src="media/barrow.svg" alt="BACK"/>`
            div.appendChild(back);
        }

        iconArray.forEach(icon => {
            if (icon.sub) {
                div.appendChild(createParentIcon(icon))
                createMenu(menuId, icon.id, icon.text, icon.sub);
            } else {
                div.appendChild(createDragIcon(icon))
            }
        })
        //adds the line and ruler tools to the main menu only
        if (menuId == mainId) div.innerHTML += createLineAndRulerIcon();
    }

    createMenu(null, mainId, 'Main Menu', mapMenuIcons);
}

addMapMenus();