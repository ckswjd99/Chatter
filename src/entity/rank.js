const rank = {
    ADMIN: 0,
    GUEST: 1,
    NORMAL: 2,
    BANNED: 3,
}

function rankToString(rank) {
    const s = ["ADMIN", "GUEST", "NORMAL", "BANNED"]
    return s[rank]
}

exports.rank = rank
exports.rankToString = rankToString